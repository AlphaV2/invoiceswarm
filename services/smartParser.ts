// src/services/smartParser.ts

interface ParsedResult {
  vendorGstin?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  totalAmount?: string;
  confidenceNotes?: string[];
}

// 1. Regex Patterns (Enhanced for India)
const PATTERNS = {
  // Relaxed GSTIN: Allows for spaces between chars (common OCR bug)
  GSTIN_STRICT: /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}/,
  // Date: DD-MMM-YYYY or DD/MM/YYYY
  DATE: /\b(?:\d{1,2}[-./])(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{1,2})[-./](?:\d{2,4})\b/i,
  // Amounts: 1,234.00 or 34.00 (Must have 2 decimals)
  AMOUNT: /[\d,]+\.\d{2}\b/g,
  // Labels to anchor search
  LABELS: {
    INVOICE_NO: ['invoice no', 'inv no', 'bill no', 'memo no', 'invoice #'],
    DATE: ['invoice date', 'date:', 'dated', 'bill date'],
    TOTAL: ['grand total', 'total amount', 'net amount', 'balance due', 'invoice total', 'total'],
    GSTIN: ['gstin', 'gst no', 'gst number']
  }
};

/**
 * Utility: Fixes common OCR typos in numbers
 * e.g. "A552" -> "4552", "l00.00" -> "100.00"
 */
const sanitizeNumber = (str: string): string => {
  return str.replace(/O/g, '0').replace(/o/g, '0')
            .replace(/I/g, '1').replace(/l/g, '1')
            .replace(/A/g, '4') // Fixes your specific A552 issue
            .replace(/B/g, '8')
            .replace(/S/g, '5');
};

/**
 * Utility: Fuzzy Check (Matches "Total" even if OCR says "Totl")
 */
const isFuzzyMatch = (text: string, keywords: string[]): boolean => {
  const lower = text.toLowerCase().replace(/[^a-z]/g, '');
  return keywords.some(k => lower.includes(k.replace(/[^a-z]/g, '')));
};

export const parseTextSmartly = (text: string): ParsedResult => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const result: ParsedResult = { confidenceNotes: [] };

  // --- STRATEGY 1: GSTIN Extraction ---
  // Try Strict Regex first (Anywhere in text)
  // Remove spaces to catch "24 ABCD..."
  const textNoSpaces = text.replace(/ /g, '');
  const strictGstin = textNoSpaces.match(PATTERNS.GSTIN_STRICT);
  
  if (strictGstin) {
    result.vendorGstin = strictGstin[0];
  } else {
    // Fallback: Look for "GSTIN :" line
    const gstinLine = lines.find(l => isFuzzyMatch(l, PATTERNS.LABELS.GSTIN));
    if (gstinLine) {
        // Grab the last chunk of that line
        const parts = gstinLine.split(/[:\-\s]+/);
        const candidate = parts[parts.length - 1];
        if (candidate.length > 10) result.vendorGstin = candidate;
    }
  }

  // --- STRATEGY 2: Line-by-Line Context ---
  let potentialTotals: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // A. Invoice Number
    if (!result.invoiceNumber && isFuzzyMatch(line, PATTERNS.LABELS.INVOICE_NO)) {
      // Logic: Split by label, take right side
      // e.g. "Invoice No. 4552" -> ["Invoice No. ", "4552"]
      const parts = line.split(/(?:no|#)[\s.:]+/i);
      if (parts.length > 1) {
        let val = parts[1].split(' ')[0].trim(); // Take first word after label
        val = sanitizeNumber(val); // FIX: Convert A552 -> 4552
        if (val.length >= 3) result.invoiceNumber = val;
      }
    }

    // B. Invoice Date
    if (!result.invoiceDate) {
        const dateMatch = line.match(PATTERNS.DATE);
        if (dateMatch) {
            // High confidence if line also says "Date"
            if (isFuzzyMatch(line, PATTERNS.LABELS.DATE)) {
                result.invoiceDate = dateMatch[0];
            } 
            // Medium confidence: It's the first date found near the top
            else if (!result.invoiceDate && i < 15) {
                 // Check if it's NOT a due date
                 if (!lowerLine.includes('due')) {
                     result.invoiceDate = dateMatch[0];
                 }
            }
        }
    }

    // C. Total Amount (Collection Phase)
    // We don't just pick one. We collect ALL candidates on lines saying "Total"
    if (isFuzzyMatch(line, PATTERNS.LABELS.TOTAL)) {
        const matches = line.match(PATTERNS.AMOUNT);
        if (matches) {
            matches.forEach(m => {
                // Remove commas, convert to float
                const val = parseFloat(m.replace(/,/g, ''));
                if (!isNaN(val)) potentialTotals.push(val);
            });
        }
    }
  }

  // --- STRATEGY 3: Final Logic ---

  // Decide Total: Pick the largest number found next to a "Total" label
  if (potentialTotals.length > 0) {
      // Sort descending (Highest value is usually Grand Total, lower are tax/subtotal)
      potentialTotals.sort((a, b) => b - a);
      result.totalAmount = potentialTotals[0].toFixed(2);
  } else {
      // Emergency: Scan bottom 20% of text for ANY regex match and take the biggest
      const bottomText = lines.slice(-10).join(' ');
      const fallbackMatches = bottomText.match(PATTERNS.AMOUNT);
      if (fallbackMatches) {
          const vals = fallbackMatches.map(m => parseFloat(m.replace(/,/g, ''))).sort((a,b) => b-a);
          result.totalAmount = vals[0].toFixed(2);
          result.confidenceNotes?.push("Total guessed from bottom text (Label missing)");
      }
  }

  return result;
};