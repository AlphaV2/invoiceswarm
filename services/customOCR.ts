// src/services/customOCR.ts
import Tesseract from 'tesseract.js';
import { preprocessImage } from './imageProcessor';
import { parseTextSmartly } from './smartParser';

export const scanInvoiceLocal = async (imageFile: File) => {
  console.log("[OCR] 1. Upscaling Image...");
  const processedBuffer = await preprocessImage(imageFile);

  console.log("[OCR] 2. Tesseract Recognition...");
  // 'psm: 6' assumes a single uniform block of text (good for invoices)
  // 'psm: 3' is fully automatic (default)
  const result = await Tesseract.recognize(
    processedBuffer,
    'eng',
    { 
      logger: m => { if(m.status === 'recognizing text') console.log(m.progress) } 
    }
  );

  const rawText = result.data.text;
  console.log("[OCR] 3. Raw Text:\n", rawText);

  console.log("[OCR] 4. Parsing...");
  const data = parseTextSmartly(rawText);

  return {
    rawText,
    confidence: result.data.confidence,
    ...data
  };
};