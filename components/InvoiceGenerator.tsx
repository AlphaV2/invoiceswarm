
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Download, Plus, Trash2, FileText, Printer, Save, Upload, ChevronDown, ChevronUp, Image as ImageIcon, Star, Zap, Shield, RefreshCw, ZoomIn, ZoomOut, Maximize, Monitor } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { addToHistory } from '../services/storageService';

interface LineItem {
  desc: string;
  qty: number;
  rate: number;
}

const InvoiceGenerator: React.FC = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [openSection, setOpenSection] = useState<string>('company');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [zoom, setZoom] = useState(1);

  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [invoice, setInvoice] = useState({
    logo: null as string | null,
    companyName: 'TechFlow Solutions LLP',
    companyAddress: 'Plot No. 12, Hitech City,\nHyderabad, Telangana, 500081, India',
    companyGstin: '36AAAAA0000A1Z5',
    companyEmail: 'accounts@techflow.io',
    clientName: '',
    clientAddress: '',
    clientGstin: '',
    invoiceNo: `INV-${new Date().getFullYear()}-001`,
    poNumber: '',
    date: today,
    dueDate: nextMonth,
    currency: '₹',
    items: [{ desc: 'Web Development Services', qty: 1, rate: 25000 }] as LineItem[],
    taxRate: 18,
    taxName: 'GST',
    notes: 'Thank you for your business. We look forward to working with you again.',
    terms: '1. Payment is due within the due date.\n2. Late payments are subject to a 2% monthly interest charge.\n3. Please include the invoice number in your payment reference.',
    bankDetails: 'Bank Name: HDFC Bank\nA/C No: 50200012345678\nIFSC: HDFC0001234\nBranch: Hitech City, Hyderabad',
    signature: null as string | null
  });

  // Auto-fit zoom on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.offsetWidth;
        const invoiceWidth = 794; // A4 width in px
        const padding = 48; // Space for visual comfort
        // Calculate scale, cap at 1.1 for slight zoom on large screens, allow shrinkage for mobile
        const newZoom = Math.min((containerWidth - padding) / invoiceWidth, 1.1);
        setZoom(Math.max(newZoom, 0.3)); // Don't let it get too tiny
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
              const img = new Image();
              img.src = event.target?.result as string;
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const MAX_WIDTH = 300;
                  const scaleSize = MAX_WIDTH / img.width;
                  canvas.width = MAX_WIDTH;
                  canvas.height = img.height * scaleSize;
                  const ctx = canvas.getContext('2d');
                  ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                  resolve(canvas.toDataURL('image/jpeg', 0.8));
              }
          }
      })
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        try {
            const compressed = await compressImage(file);
            setInvoice(prev => ({ ...prev, logo: compressed }));
        } catch (e) {
            console.error("Image processing failed", e);
        }
    }
  };
  
  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        try {
            const compressed = await compressImage(file);
            setInvoice(prev => ({ ...prev, signature: compressed }));
        } catch (e) {
             console.error("Image processing failed", e);
        }
    }
  };

  const addItem = useCallback(() => {
    setInvoice(prev => ({ ...prev, items: [...prev.items, { desc: '', qty: 1, rate: 0 }] }));
  }, []);

  const removeItem = useCallback((index: number) => {
    setInvoice(prev => {
        if (prev.items.length > 1) {
            return { ...prev, items: prev.items.filter((_, i) => i !== index) };
        }
        return prev;
    });
  }, []);

  const updateItem = (index: number, field: keyof LineItem, value: any) => {
    setInvoice(prev => {
        const newItems = [...prev.items];
        // @ts-ignore
        newItems[index][field] = value;
        return { ...prev, items: newItems };
    });
  };

  const subtotal = invoice.items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const taxAmount = (subtotal * invoice.taxRate) / 100;
  const total = subtotal + taxAmount;

  const saveToDashboard = () => {
      addToHistory({
          id: 'gen_' + Date.now(),
          date: new Date().toISOString(),
          fileName: `Invoice-${invoice.invoiceNo}`,
          vendor: invoice.companyName, 
          amount: total.toFixed(2),
          status: 'SUCCESS',
          source: 'GENERATOR',
          data: {
              invoiceNumber: invoice.invoiceNo,
              totalAmount: total.toFixed(2),
              vendorName: invoice.companyName,
              buyerName: invoice.clientName,
              lineItems: invoice.items.map(i => ({
                  description: i.desc,
                  quantity: i.qty,
                  unitPrice: i.rate,
                  amount: i.qty * i.rate
              }))
          }
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const element = invoiceRef.current;
      
      // Store current style to revert later
      const originalTransform = element.style.transform;
      
      // Reset scale to 1:1 for the capture
      element.style.transform = 'scale(1)';
      element.style.margin = '0'; // Remove margin for clean capture
      
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Restore style for the viewer
      element.style.transform = originalTransform;
      element.style.margin = 'auto'; // Revert centering

      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoice.invoiceNo || 'invoice'}.pdf`);
      
      saveToDashboard(); 
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please ensure all images are valid.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const resetInvoice = () => {
      if(confirm("Reset invoice to default template?")) {
        setInvoice({
            logo: null,
            companyName: 'Your Company Name',
            companyAddress: 'Your Address Here',
            companyGstin: '',
            companyEmail: '',
            clientName: '',
            clientAddress: '',
            clientGstin: '',
            invoiceNo: `INV-${new Date().getFullYear()}-001`,
            poNumber: '',
            date: today,
            dueDate: nextMonth,
            currency: '₹',
            items: [{ desc: 'Service / Product Description', qty: 1, rate: 0 }],
            taxRate: 18,
            taxName: 'GST',
            notes: '',
            terms: '',
            bankDetails: '',
            signature: null
        });
      }
  }

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50 no-print transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          
          <div className="flex flex-wrap justify-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide shadow-sm border border-green-200">
                <Star size={14} fill="currentColor" /> Free Forever
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide shadow-sm border border-blue-200">
                <Zap size={14} fill="currentColor" /> No Signup Required
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wide shadow-sm border border-purple-200">
                <Shield size={14} fill="currentColor" /> No Watermark
              </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Professional Invoice Generator
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Create compliant GST invoices, add your logo, and export as high-quality PDF. 
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start">
          {/* EDITOR COLUMN - LEFT */}
          <div className="xl:w-1/3 w-full space-y-4">
            
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300 flex items-start gap-3">
               <div className="bg-white dark:bg-blue-900 p-1.5 rounded-full shadow-sm"><FileText size={16}/></div>
               <p><span className="font-bold">Pro Tip:</span> You can edit text directly on the Invoice Preview (right side) for faster changes.</p>
            </div>

            {/* Branding Section */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <button onClick={() => toggleSection('company')} className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                  <Upload size={16} className="text-trust-500"/> Branding & Company
                </h3>
                {openSection === 'company' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {openSection === 'company' && (
                <div className="p-5 space-y-4 animate-fade-in-up border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden group cursor-pointer">
                      {invoice.logo ? (
                        <img src={invoice.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-slate-400" />
                      )}
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500 mb-1">Company Logo</p>
                      <label className="text-xs text-trust-600 cursor-pointer hover:underline">
                        Click box to upload (Auto-resized)
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Company Name</label>
                    <input type="text" value={invoice.companyName} onChange={(e) => setInvoice(prev => ({...prev, companyName: e.target.value}))} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Address</label>
                    <textarea value={invoice.companyAddress} onChange={(e) => setInvoice(prev => ({...prev, companyAddress: e.target.value}))} className="input-field h-20" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">GSTIN / Tax ID</label>
                      <input type="text" value={invoice.companyGstin} onChange={(e) => setInvoice(prev => ({...prev, companyGstin: e.target.value}))} className="input-field" />
                    </div>
                     <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                      <input type="email" value={invoice.companyEmail} onChange={(e) => setInvoice(prev => ({...prev, companyEmail: e.target.value}))} className="input-field" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Client Section */}
             <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <button onClick={() => toggleSection('client')} className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full border-2 border-trust-500"></div> Client Details
                </h3>
                {openSection === 'client' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {openSection === 'client' && (
                <div className="p-5 space-y-4 animate-fade-in-up border-t border-slate-100 dark:border-slate-700">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Client Business Name</label>
                    <input type="text" placeholder="e.g. Acme Corp" value={invoice.clientName} onChange={(e) => setInvoice(prev => ({...prev, clientName: e.target.value}))} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Client Address</label>
                    <textarea placeholder="Client's billing address" value={invoice.clientAddress} onChange={(e) => setInvoice(prev => ({...prev, clientAddress: e.target.value}))} className="input-field h-20" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Client GSTIN</label>
                      <input type="text" placeholder="Optional" value={invoice.clientGstin} onChange={(e) => setInvoice(prev => ({...prev, clientGstin: e.target.value}))} className="input-field" />
                    </div>
                     <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">PO Number</label>
                      <input type="text" placeholder="Optional" value={invoice.poNumber} onChange={(e) => setInvoice(prev => ({...prev, poNumber: e.target.value}))} className="input-field" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Invoice Details Section */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
               <button onClick={() => toggleSection('details')} className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                  <FileText size={16} className="text-trust-500"/> Invoice Details
                </h3>
                {openSection === 'details' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

               {openSection === 'details' && (
                <div className="p-5 space-y-4 animate-fade-in-up border-t border-slate-100 dark:border-slate-700">
                   <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Invoice Number</label>
                        <input type="text" value={invoice.invoiceNo} onChange={(e) => setInvoice(prev => ({...prev, invoiceNo: e.target.value}))} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Invoice Date</label>
                        <input type="date" value={invoice.date} onChange={(e) => setInvoice(prev => ({...prev, date: e.target.value}))} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Due Date</label>
                        <input type="date" value={invoice.dueDate} onChange={(e) => setInvoice(prev => ({...prev, dueDate: e.target.value}))} className="input-field" />
                      </div>
                       <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Currency Symbol</label>
                        <select 
                          value={invoice.currency} 
                          onChange={(e) => setInvoice(prev => ({...prev, currency: e.target.value}))} 
                          className="input-field appearance-none"
                        >
                          <option value="₹">₹ (INR)</option>
                          <option value="$">$ (USD)</option>
                          <option value="€">€ (EUR)</option>
                          <option value="£">£ (GBP)</option>
                        </select>
                      </div>
                   </div>
                </div>
               )}
            </div>

             {/* Footer & Payment Section */}
             <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
               <button onClick={() => toggleSection('footer')} className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                  <Save size={16} className="text-trust-500"/> Bank & Terms
                </h3>
                {openSection === 'footer' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

               {openSection === 'footer' && (
                <div className="p-5 space-y-4 animate-fade-in-up border-t border-slate-100 dark:border-slate-700">
                   <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Bank Details / Payment Info</label>
                    <textarea value={invoice.bankDetails} onChange={(e) => setInvoice(prev => ({...prev, bankDetails: e.target.value}))} className="input-field h-24 font-mono text-xs" />
                  </div>
                   <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Terms & Conditions</label>
                    <textarea value={invoice.terms} onChange={(e) => setInvoice(prev => ({...prev, terms: e.target.value}))} className="input-field h-24" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Notes / Memo</label>
                    <textarea value={invoice.notes} onChange={(e) => setInvoice(prev => ({...prev, notes: e.target.value}))} className="input-field h-16" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Signature</label>
                     <div className="relative w-full h-16 bg-slate-100 dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden group cursor-pointer">
                      {invoice.signature ? (
                        <img src={invoice.signature} alt="Sign" className="h-full object-contain" />
                      ) : (
                        <span className="text-xs text-slate-400">Click to upload Signature</span>
                      )}
                      <input type="file" accept="image/*" onChange={handleSignatureUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>
               )}
            </div>
            
             {/* Edit Line Items Mobile */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-4 xl:hidden shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Edit Line Items</h3>
               {invoice.items.map((item, idx) => (
                 <div key={idx} className="flex flex-col gap-2 mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                     <input 
                        placeholder="Description"
                        value={item.desc}
                        onChange={(e) => updateItem(idx, 'desc', e.target.value)}
                        className="input-field"
                     />
                     <div className="flex gap-2">
                        <input 
                          type="number"
                          placeholder="Qty"
                          value={item.qty}
                          onChange={(e) => updateItem(idx, 'qty', Number(e.target.value))}
                          className="input-field w-20"
                        />
                        <input 
                          type="number"
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) => updateItem(idx, 'rate', Number(e.target.value))}
                          className="input-field flex-1"
                        />
                        <button onClick={() => removeItem(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                     </div>
                 </div>
               ))}
               <button onClick={addItem} className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-trust-600 border border-dashed border-trust-300 rounded-lg hover:bg-trust-50">
                  <Plus size={14} /> Add New Item
               </button>
            </div>

          </div>

          {/* PREVIEW COLUMN - RIGHT */}
          <div className="xl:w-2/3 w-full">
            <div className="sticky top-24">
              
              {/* Toolbar */}
              <div className="flex flex-wrap gap-4 mb-4 justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <button 
                        onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} 
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                        title="Zoom Out"
                    >
                        <ZoomOut size={18} />
                    </button>
                    <span className="font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
                    <button 
                        onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} 
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                        title="Zoom In"
                    >
                        <ZoomIn size={18} />
                    </button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                    <button 
                         onClick={() => {
                             if(previewContainerRef.current) {
                                 const width = previewContainerRef.current.offsetWidth;
                                 setZoom((width - 48) / 794);
                             }
                         }}
                         className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-xs font-medium flex items-center gap-1"
                         title="Fit to Screen"
                    >
                        <Maximize size={16}/> Fit
                    </button>
                 </div>

                 <div className="flex gap-2 w-full md:w-auto">
                    {saveStatus === 'saved' && (
                        <span className="text-green-600 text-sm font-bold flex items-center animate-fade-in-up px-3">Saved!</span>
                    )}
                     <button 
                      onClick={resetInvoice} 
                      className="md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-medium transition text-sm"
                      title="Reset Template"
                    >
                       <RefreshCw size={16} /> Reset
                    </button>
                    <button 
                      onClick={handleDownloadPDF} 
                      disabled={isGeneratingPdf}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-trust-600 text-white rounded-lg hover:bg-trust-700 shadow-lg font-bold transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                    >
                       {isGeneratingPdf ? 'Generating...' : <><Download size={16} /> Save PDF</>}
                    </button>
                 </div>
              </div>

              {/* THE INVOICE PAPER - FIXED WIDTH A4 */}
              <div 
                ref={previewContainerRef}
                className="bg-slate-200/50 dark:bg-slate-900/50 p-4 md:p-8 rounded-xl overflow-hidden shadow-inner border border-slate-300 dark:border-slate-800 relative min-h-[500px] flex justify-center bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"
              >
                 <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
                     <div 
                        ref={invoiceRef}
                        id="invoice-preview"
                        className="bg-white text-slate-900 w-[794px] min-h-[1123px] p-12 shadow-2xl relative transition-shadow duration-300 hover:shadow-3xl"
                        style={{width: '210mm', minHeight: '297mm'}} // A4 Exact Dimensions
                     >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-12">
                        <div className="flex flex-col gap-4">
                            {invoice.logo ? (
                                <img src={invoice.logo} alt="Company Logo" className="h-16 w-auto object-contain object-left" />
                            ) : (
                                <div className="h-16 w-16 bg-slate-100 rounded flex items-center justify-center text-slate-300 text-xs">NO LOGO</div>
                            )}
                            <div>
                                <input 
                                    className="text-xl font-bold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 hover:bg-blue-50/50 focus:bg-white focus:ring-1 focus:ring-trust-200 rounded px-1 -ml-1 w-full"
                                    value={invoice.companyName}
                                    onChange={(e) => setInvoice(prev => ({...prev, companyName: e.target.value}))}
                                    placeholder="Your Company Name"
                                />
                                <textarea 
                                    className="text-sm text-slate-500 whitespace-pre-line leading-relaxed mt-1 bg-transparent outline-none w-full resize-none hover:bg-blue-50/50 focus:bg-white focus:ring-1 focus:ring-trust-200 rounded px-1 -ml-1 overflow-hidden"
                                    value={invoice.companyAddress}
                                    onChange={(e) => setInvoice(prev => ({...prev, companyAddress: e.target.value}))}
                                    rows={3}
                                    placeholder="Company Address"
                                />
                                {invoice.companyGstin && (
                                    <p className="text-sm text-slate-600 mt-2 font-mono flex items-center">
                                        GSTIN: 
                                        <input 
                                            className="ml-1 bg-transparent outline-none hover:bg-blue-50/50 focus:bg-white focus:ring-1 focus:ring-trust-200 rounded px-1"
                                            value={invoice.companyGstin}
                                            onChange={(e) => setInvoice(prev => ({...prev, companyGstin: e.target.value}))}
                                        />
                                    </p>
                                )}
                                <p className="text-sm text-slate-600 flex items-center">
                                    Email:
                                    <input 
                                        className="ml-1 bg-transparent outline-none hover:bg-blue-50/50 focus:bg-white focus:ring-1 focus:ring-trust-200 rounded px-1 w-64"
                                        value={invoice.companyEmail}
                                        onChange={(e) => setInvoice(prev => ({...prev, companyEmail: e.target.value}))}
                                        placeholder="email@example.com"
                                    />
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-5xl font-light text-slate-200 tracking-tight mb-4">INVOICE</h2>
                            <div className="space-y-1">
                                <div className="text-sm text-slate-500 flex justify-end items-center gap-2">
                                    Invoice No: 
                                    <input 
                                        className="font-bold text-slate-800 bg-transparent outline-none text-right hover:bg-blue-50/50 focus:bg-white focus:ring-1 focus:ring-trust-200 rounded px-1 w-32"
                                        value={invoice.invoiceNo}
                                        onChange={(e) => setInvoice(prev => ({...prev, invoiceNo: e.target.value}))}
                                    />
                                </div>
                                <div className="text-sm text-slate-500 flex justify-end items-center gap-2">
                                    Date: 
                                    <input 
                                        type="date"
                                        className="font-bold text-slate-800 bg-transparent outline-none text-right hover:bg-blue-50/50 focus:bg-white focus:ring-1 focus:ring-trust-200 rounded px-1 w-32"
                                        value={invoice.date}
                                        onChange={(e) => setInvoice(prev => ({...prev, date: e.target.value}))}
                                    />
                                </div>
                                <div className="text-sm text-slate-500 flex justify-end items-center gap-2">
                                    Due Date: 
                                    <input 
                                        type="date"
                                        className="font-bold text-slate-800 bg-transparent outline-none text-right hover:bg-blue-50/50 focus:bg-white focus:ring-1 focus:ring-trust-200 rounded px-1 w-32"
                                        value={invoice.dueDate}
                                        onChange={(e) => setInvoice(prev => ({...prev, dueDate: e.target.value}))}
                                    />
                                </div>
                            </div>
                        </div>
                        </div>

                        {/* Bill To */}
                        <div className="flex justify-between mb-10 pb-8 border-b border-slate-100">
                        <div className="w-1/2 pr-8">
                            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Bill To</h3>
                            <input 
                                className="text-lg font-bold text-slate-800 w-full bg-transparent outline-none placeholder:text-slate-300 hover:bg-blue-50/50 focus:bg-white focus:ring-1 focus:ring-trust-200 rounded px-1 -ml-1"
                                value={invoice.clientName}
                                onChange={(e) => setInvoice(prev => ({...prev, clientName: e.target.value}))}
                                placeholder="Client Business Name"
                            />
                            <textarea 
                                className="text-sm text-slate-500 whitespace-pre-line mt-1 w-full bg-transparent outline-none resize-none hover:bg-blue-50/50 focus:bg-white focus:ring-1 focus:ring-trust-200 rounded px-1 -ml-1"
                                value={invoice.clientAddress}
                                onChange={(e) => setInvoice(prev => ({...prev, clientAddress: e.target.value}))}
                                rows={3}
                                placeholder="Client Address"
                            />
                             <div className="flex items-center gap-1 text-sm text-slate-500 mt-2">
                                GSTIN: 
                                <input 
                                    className="bg-transparent outline-none flex-1 hover:bg-blue-50/50 focus:bg-white focus:ring-1 focus:ring-trust-200 rounded px-1"
                                    value={invoice.clientGstin}
                                    onChange={(e) => setInvoice(prev => ({...prev, clientGstin: e.target.value}))}
                                    placeholder="Optional"
                                />
                             </div>
                        </div>
                        </div>

                        {/* Table */}
                        <table className="w-full mb-8">
                        <thead>
                            <tr className="bg-slate-50 text-slate-600 border-y border-slate-200">
                                <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider w-1/2">Item Description</th>
                                <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider">Qty</th>
                                <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider">Rate</th>
                                <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider">Amount</th>
                                <th className="w-8 print:hidden"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoice.items.map((item, i) => (
                                <tr key={i} className="group">
                                    <td className="py-3 px-4 text-sm font-medium text-slate-700 relative">
                                    <input 
                                        className="w-full bg-transparent outline-none hover:bg-blue-50/50 focus:bg-white focus:ring-1 focus:ring-trust-200 rounded px-1"
                                        value={item.desc}
                                        onChange={(e) => updateItem(i, 'desc', e.target.value)}
                                        placeholder="Item Name"
                                    />
                                    </td>
                                    <td className="py-3 px-4 text-right text-sm text-slate-500">
                                    <input 
                                        type="number"
                                        className="w-12 text-right bg-transparent outline-none hover:bg-blue-50/50 focus:bg-white focus:ring-1 focus:ring-trust-200 rounded px-1"
                                        value={item.qty}
                                        onChange={(e) => updateItem(i, 'qty', Number(e.target.value))}
                                    />
                                    </td>
                                    <td className="py-3 px-4 text-right text-sm text-slate-500">
                                    <div className="inline-block">
                                        <span className="text-slate-400 mr-1">{invoice.currency}</span>
                                        <input 
                                            type="number"
                                            className="w-20 text-right bg-transparent outline-none hover:bg-blue-50/50 focus:bg-white focus:ring-1 focus:ring-trust-200 rounded px-1"
                                            value={item.rate}
                                            onChange={(e) => updateItem(i, 'rate', Number(e.target.value))}
                                        />
                                    </div>
                                    </td>
                                    <td className="py-3 px-4 text-right text-sm font-bold text-slate-700">{invoice.currency}{(item.qty * item.rate).toFixed(2)}</td>
                                    <td className="print:hidden">
                                    <button onClick={() => removeItem(i)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition xl:block hidden"><Trash2 size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>

                        <div className="print:hidden mb-8 pl-4">
                        <button onClick={addItem} className="text-xs font-bold text-trust-600 flex items-center gap-1 hover:underline xl:flex hidden"><Plus size={12}/> Add Line Item</button>
                        </div>

                        {/* Totals Section */}
                        <div className="flex justify-between items-start mb-12">
                        <div className="w-1/2 pr-8">
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</h4>
                                <textarea 
                                    className="text-sm text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-100 w-full outline-none resize-none focus:ring-1 focus:ring-trust-200"
                                    value={invoice.notes}
                                    onChange={(e) => setInvoice(prev => ({...prev, notes: e.target.value}))}
                                    rows={2}
                                />
                            </div>
                            
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bank Details</h4>
                                <textarea 
                                    className="text-sm text-slate-600 whitespace-pre-line font-mono leading-relaxed border-l-2 border-trust-300 pl-3 w-full outline-none bg-transparent resize-none focus:bg-blue-50/30 rounded"
                                    value={invoice.bankDetails}
                                    onChange={(e) => setInvoice(prev => ({...prev, bankDetails: e.target.value}))}
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="w-1/3">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="font-medium text-slate-800">{invoice.currency}{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">Tax</span>
                                        {/* Inline Tax Edit */}
                                        <div className="flex items-center bg-slate-100 rounded px-1 print:hidden group">
                                        <input 
                                            type="text" 
                                            className="w-8 bg-transparent text-xs font-medium text-center outline-none group-hover:text-trust-600" 
                                            value={invoice.taxName}
                                            onChange={(e) => setInvoice(prev => ({...prev, taxName: e.target.value}))}
                                        />
                                        <span className="text-xs text-slate-400">@</span>
                                        <input 
                                            type="number" 
                                            className="w-8 bg-transparent text-xs font-medium text-center outline-none group-hover:text-trust-600" 
                                            value={invoice.taxRate}
                                            onChange={(e) => setInvoice(prev => ({...prev, taxRate: Number(e.target.value)}))}
                                        />
                                        <span className="text-xs text-slate-400">%</span>
                                        </div>
                                        <span className="hidden print:inline text-slate-500 text-xs">({invoice.taxName} {invoice.taxRate}%)</span>
                                    </div>
                                    <span className="font-medium text-slate-800">{invoice.currency}{taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold border-t-2 border-slate-800 pt-3 mt-2">
                                    <span className="text-slate-800">Total</span>
                                    <span className="text-trust-600">{invoice.currency}{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        </div>

                        {/* Footer Terms & Sign */}
                        <div className="absolute bottom-12 left-12 right-12 border-t border-slate-100 pt-8 flex justify-between items-end">
                        <div className="w-2/3 pr-8">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Terms & Conditions</h4>
                            <textarea 
                                className="text-xs text-slate-500 leading-relaxed whitespace-pre-line w-full bg-transparent outline-none resize-none focus:bg-blue-50/30 rounded p-1 -ml-1"
                                value={invoice.terms}
                                onChange={(e) => setInvoice(prev => ({...prev, terms: e.target.value}))}
                                rows={4}
                            />
                        </div>
                        <div className="text-center">
                            {invoice.signature && <img src={invoice.signature} alt="Sign" className="h-12 object-contain mb-2 mx-auto" />}
                            <p className="text-xs font-bold text-slate-900 uppercase">Authorized Signatory</p>
                        </div>
                        </div>
                        
                        <div className="absolute bottom-4 right-6 opacity-20 print:opacity-50">
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-slate-900">Generated by InvoiceSnap</span>
                        </div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .input-field {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          background-color: transparent;
          font-size: 0.875rem;
          color: inherit;
          outline: none;
          transition: border-color 0.2s;
        }
        .dark .input-field {
          border-color: #334155;
        }
        .input-field:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </section>
  );
};

export default InvoiceGenerator;
