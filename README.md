# InvoiceSnap (Beta) 🚀

**India's Best Free Invoice Generator & AI Automation Suite.**

InvoiceSnap is a modern, privacy-first web application designed for Indian SMBs, Freelancers, and Chartered Accountants. It leverages **Google's Gemini 2.5 Flash AI** to automate invoice data extraction (OCR), generate GST-compliant invoices instantly, and find HSN codes using natural language.

![Status](https://img.shields.io/badge/Status-Beta-orange)
![Tech](https://img.shields.io/badge/Stack-React_|_TypeScript_|_Tailwind-blue)
![AI](https://img.shields.io/badge/AI-Google_Gemini-purple)

## 🌟 Key Features

### 1. 🧾 Free Invoice Generator
- **Zero Signup Required:** Create invoices instantly.
- **GST Compliant:** Fields for GSTIN, HSN, Tax splits (CGST/SGST/IGST).
- **Client-Side Processing:** No data is stored on servers; generates PDFs directly in the browser.
- **Customizable:** Add logos, signatures, and payment terms.

### 2. 🤖 AI Invoice OCR (Bulk Scanner)
- **Powered by Gemini 2.5:** Extracts data from images/PDFs with high accuracy.
- **Bulk Upload:** Process multiple invoices at once.
- **Smart Extraction:** Identifies Vendor Name, GSTIN, Invoice #, Dates, and Line Items.
- **Export to CSV/Excel:** Download structured data for accounting software.

### 3. 🔍 AI HSN Code Finder
- **Natural Language Search:** Type "Leather bags" or "Web hosting" to find the correct HSN/SAC code.
- **GST Rates:** Provides the applicable GST rate for the found code.

### 4. 📊 Dashboard
- **Local History:** Tracks generated and scanned invoices using LocalStorage.
- **Analytics:** View total spend/revenue and credits remaining.

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS
*   **AI Model:** Google Gemini 2.5 Flash via `@google/genai`
*   **PDF Generation:** `jspdf`, `html2canvas`
*   **Icons:** Lucide React
*   **State Management:** React Hooks + LocalStorage

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   A Google AI Studio API Key (Gemini API)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/invoicesnap.git
    cd invoicesnap
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Gemini API Key:
    ```env
    # If using Vite
    VITE_API_KEY=your_google_gemini_api_key_here
    
    # If using Create React App
    REACT_APP_API_KEY=your_google_gemini_api_key_here
    
    # Or generically for the build process
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the application**
    ```bash
    npm start
    # or
    npm run dev
    ```

## 🛣️ Roadmap

We are currently in **Phase 1 (Beta)**. Here is what's coming next:

- [ ] **GST Validator:** Bulk verify GSTIN validity and filing status.
- [ ] **E-Way Bill Generation:** One-click generation for invoices > ₹50k.
- [ ] **GSTR-2B Reconciliation:** Auto-match purchase register with government data.
- [ ] **Inventory Sync:** Simple stock management hooks.

## 🔒 Privacy & Security

*   **Local-First:** Most data (invoice history, drafts) is stored in the user's browser `LocalStorage`.
*   **Ephemeral Processing:** Images sent to AI for OCR are processed in memory and not permanently stored on our servers.

## 🤝 Contributing

Contributions are welcome!
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📞 Contact

**InterXect Labs**  
Email: [hemantgoshika3@gmail.com](mailto:hemantgoshika3@gmail.com)  
Location: Hyderabad, India

---
*Built with ❤️ for Indian Business.*
