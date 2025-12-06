
export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number | string;
  amount: number | string;
  hsnCode?: string;
  gstRate?: number;
}

export interface ExtractedData {
  vendorName?: string;
  vendorGstin?: string;
  vendorAddress?: string;
  buyerName?: string;
  buyerGstin?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  poNumber?: string;
  currency?: string;
  subtotal?: string;
  taxAmount?: string;
  totalAmount?: string;
  cgst?: string;
  sgst?: string;
  igst?: string;
  lineItems?: LineItem[];
  paymentTerms?: string;
  bankDetails?: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  isLoggedIn: boolean;
  email?: string;
  creditsUsed: number;
  maxCredits: number; // 15 for free, Infinity for pro
  bulkEventsUsed: number; // Track how many times bulk upload was used
  isPro: boolean;
  plan: 'FREE' | 'PRO_MONTHLY' | 'LIFETIME' | 'PAYG';
  joinedAt: string;
}

export interface InvoiceHistoryItem {
  id: string;
  date: string; // ISO String
  fileName: string;
  vendor: string;
  amount: string;
  status: 'SUCCESS' | 'FAILED';
  source: 'OCR' | 'GENERATOR'; // Track where it came from
  data?: ExtractedData;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
  LIMIT_REACHED = 'LIMIT_REACHED',
  BULK_LIMIT_REACHED = 'BULK_LIMIT_REACHED'
}
