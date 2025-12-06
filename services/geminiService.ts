import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedData } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert Indian Chartered Accountant AI. Your job is to extract data from GST Invoices with 100% precision.

CRITICAL EXTRACTION FIELDS (Indian GST Context):
1. **GSTIN**: Extract Vendor GSTIN (15 chars) and Buyer GSTIN.
2. **Tax Split**: Identify CGST, SGST, and IGST amounts separately.
3. **HSN/SAC**: Extract HSN codes for line items.
4. **Dates**: Format all dates to YYYY-MM-DD.
5. **Amounts**: normalize to 2 decimal places.

If a field is missing, return empty string or 0. Do not hallucinate.
`;

export const extractInvoiceData = async (base64Image: string): Promise<ExtractedData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your settings.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Add a timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out")), 30000)
    );

    const apiCallPromise = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: "Extract structured GST invoice data.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vendorName: { type: Type.STRING },
            vendorGstin: { type: Type.STRING },
            vendorAddress: { type: Type.STRING },
            buyerName: { type: Type.STRING },
            buyerGstin: { type: Type.STRING },
            invoiceNumber: { type: Type.STRING },
            invoiceDate: { type: Type.STRING },
            dueDate: { type: Type.STRING },
            currency: { type: Type.STRING },
            subtotal: { type: Type.STRING },
            cgst: { type: Type.STRING },
            sgst: { type: Type.STRING },
            igst: { type: Type.STRING },
            taxAmount: { type: Type.STRING },
            totalAmount: { type: Type.STRING },
            lineItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  hsnCode: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unitPrice: { type: Type.STRING },
                  amount: { type: Type.STRING },
                  gstRate: { type: Type.STRING }
                },
              },
            },
            bankDetails: { type: Type.STRING }
          },
        },
      },
    });

    // Race between API call and timeout
    const response: any = await Promise.race([apiCallPromise, timeoutPromise]);

    if (response.text) {
      return JSON.parse(response.text) as ExtractedData;
    }
    throw new Error("Empty response from AI");

  } catch (error: any) {
    console.error("Extraction error:", error);
    
    // Better error messages for the UI
    if (error.message.includes("API Key")) throw new Error("Invalid API Configuration.");
    if (error.message.includes("timed out")) throw new Error("Server took too long. Try a smaller image.");
    if (error.message.includes("fetch")) throw new Error("Network error. Please check your internet.");
    
    throw new Error("Failed to process invoice. Please ensure image is clear.");
  }
};

export const identifyHSN = async (query: string): Promise<{ hsnCode: string; gstRate: string; description: string }[]> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find the most likely HSN code and GST rate for the product/service: "${query}". Return top 3 matches relevant to India.`,
        config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
            type: Type.OBJECT,
            properties: {
                hsnCode: { type: Type.STRING },
                gstRate: { type: Type.STRING },
                description: { type: Type.STRING }
            }
            }
        }
        }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
      console.error("HSN Lookup Error", error);
      return [];
  }
};