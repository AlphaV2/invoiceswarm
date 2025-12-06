import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, Zap, Copy, RefreshCw, Lock, Plus, FileSpreadsheet, AlertTriangle } from 'lucide-react';
// IMPORT THE NEW ADVANCED LOCAL OCR SERVICE
import { scanInvoiceLocal } from '../services/customOCR'; 
import { ExtractedData, ProcessingStatus, UserProfile } from '../types';
import { incrementUsage, addToHistory, incrementBulkUsage, upgradeUser } from '../services/storageService';

interface DemoSectionProps {
    user: UserProfile;
}

const DemoSection: React.FC<DemoSectionProps> = ({ user }) => {
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [results, setResults] = useState<ExtractedData[]>([]);
  const [activeResultIndex, setActiveResultIndex] = useState<number>(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const creditsRemaining = user.isPro ? 999 : (user.maxCredits - user.creditsUsed);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // BULK UPLOAD LIMIT CHECK
    if (files.length > 1 && !user.isPro) {
        if (!incrementBulkUsage()) {
             setShowPaywall(true);
             if (fileInputRef.current) fileInputRef.current.value = ''; 
             return;
        }
    }

    if (creditsRemaining < files.length && !user.isPro) {
      setStatus(ProcessingStatus.LIMIT_REACHED);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setStatus(ProcessingStatus.PROCESSING);
    setResults([]); 
    setErrorMessage('');

    const newResults: ExtractedData[] = [];
    let errorOccurred = false;

    // Process Sequentially
    for (const file of files) {
        // Increased limit to 10MB since processing is local
        if (file.size > 10 * 1024 * 1024) { 
            setErrorMessage(`File ${file.name} is too large (>10MB). Skipped.`);
            errorOccurred = true;
            continue; 
        }

        try {
            // --- NEW ADVANCED OCR CALL ---
            // This runs Image Enhancement -> Tesseract -> Smart Regex Parsing
            const ocrResult = await scanInvoiceLocal(file);

            // Determine status based on confidence
            const confidenceScore = ocrResult.confidence || 0;
            let noteString = `Confidence: ${confidenceScore.toFixed(0)}%`;
            if (confidenceScore < 60) noteString += " (Low Quality Image)";

            const extracted: ExtractedData = {
                vendorName: "Scanned Vendor", // Regex cannot reliably extract names without AI
                vendorGstin: ocrResult.vendorGstin || "",
                vendorAddress: "",
                invoiceNumber: ocrResult.invoiceNumber || "", 
                invoiceDate: ocrResult.invoiceDate || "",
                totalAmount: ocrResult.totalAmount || "0.00",
                taxAmount: "0.00",
                cgst: "0.00",
                sgst: "0.00",
                igst: "0.00",
                currency: "₹",
                lineItems: [], // Local OCR cannot extract tables cleanly
                notes: noteString
            };
            // --- END NEW LOGIC ---

            if(extracted) {
                newResults.push(extracted);
                incrementUsage(); 
                addToHistory({
                    id: Date.now().toString() + Math.random(),
                    date: new Date().toISOString(),
                    fileName: file.name,
                    vendor: extracted.vendorName || 'Unknown',
                    amount: extracted.totalAmount || '0',
                    status: 'SUCCESS',
                    source: 'OCR',
                    data: extracted
                });
            }
        } catch (err: any) {
            console.error("OCR Error:", err);
            setErrorMessage("Failed to read image. Please ensure it's a clear photo of a document.");
            errorOccurred = true;
        }
    }

    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }

    if (newResults.length > 0) {
        setResults(newResults);
        setActiveResultIndex(0);
        setStatus(ProcessingStatus.COMPLETE);
    } else {
        setStatus(ProcessingStatus.ERROR);
    }
  };

  const triggerUpload = () => {
      if(fileInputRef.current) {
          fileInputRef.current.value = ''; 
          fileInputRef.current.click();
      }
  };

  const resetScanner = () => {
      setResults([]);
      setStatus(ProcessingStatus.IDLE);
      setShowPaywall(false);
      setErrorMessage('');
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePayAsYouGo = () => {
      setTimeout(() => {
          upgradeUser('PAYG');
          setShowPaywall(false);
          alert("Pay-As-You-Go Enabled! You can now upload unlimited files.");
      }, 1000);
  }

  const downloadCSV = () => {
    if (results.length === 0) return;
    
    const headers = [
        "Vendor GSTIN", "Invoice Number", "Date", "Total Amount", "Confidence Score"
    ];

    const rows = results.map(r => {
        const escape = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
        return [
            escape(r.vendorGstin || ''),
            escape(r.invoiceNumber || ''),
            escape(r.invoiceDate || ''),
            escape(r.totalAmount || '0'),
            escape(r.notes || '')
        ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice_batch_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentData = results[activeResultIndex];

  return (
    <section id="demo" className="py-24 bg-white/50 dark:bg-slate-900/50 relative overflow-hidden transition-all duration-300">
      
      {/* Paywall Modal */}
      {showPaywall && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md animate-fade-in-up">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md text-center border-2 border-trust-500">
                  <div className="w-16 h-16 bg-trust-100 dark:bg-trust-900 rounded-full flex items-center justify-center mx-auto mb-4 text-trust-600">
                      <Lock size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Bulk Upload Limit Reached</h3>
                  <p className="text-slate-500 mb-6">Free tier is limited to 3 bulk events. You need more power!</p>
                  
                  <div className="space-y-3">
                      <button onClick={handlePayAsYouGo} className="w-full py-3 bg-trust-600 text-white font-bold rounded-xl hover:bg-trust-700 transition">
                          Enable Pay-As-You-Go (₹5/invoice)
                      </button>
                      <button onClick={() => {setShowPaywall(false); document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}} className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-200 transition">
                          View Subscription Plans
                      </button>
                  </div>
                  <button onClick={() => setShowPaywall(false)} className="mt-4 text-sm text-slate-400 hover:text-slate-600">Cancel</button>
              </div>
          </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-trust-50 dark:bg-trust-900/30 text-trust-700 dark:text-trust-300 text-xs font-semibold uppercase tracking-wide mb-4 shadow-sm border border-trust-100 dark:border-trust-800">
            <Zap size={14} className="fill-current" /> Free & Private OCR
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Upload Invoices. <span className="text-transparent bg-clip-text bg-gradient-to-r from-trust-600 to-sky-600">Get Data Locally.</span>
          </h2>
           {!user.isPro && (
            <p className="text-sm font-medium text-slate-500">
               Free Usage: {creditsRemaining} scans remaining.
            </p>
          )}
        </div>

        {/* SCANNER INTERFACE */}
        <div className="max-w-4xl mx-auto">
            
            {/* 1. UPLOAD STATE */}
            {status === ProcessingStatus.IDLE && (
                <div 
                    onClick={triggerUpload}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 text-center bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-trust-400 transition-all cursor-pointer group"
                >
                    <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                    <div className="w-20 h-20 bg-blue-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Upload size={32} className="text-trust-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Drop invoices here to scan</h3>
                    <p className="text-slate-500 mb-6">100% Client-Side. Your data never leaves this browser.</p>
                    <button className="px-6 py-3 bg-trust-600 text-white font-bold rounded-full shadow-lg hover:shadow-trust-500/25">Select Files</button>
                </div>
            )}

            {/* 2. PROCESSING STATE */}
            {(status === ProcessingStatus.PROCESSING || status === ProcessingStatus.UPLOADING) && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 text-center shadow-xl border border-slate-200 dark:border-slate-700">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                          <div className="absolute inset-0 border-4 border-trust-100 dark:border-slate-700 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-trust-600 rounded-full border-t-transparent animate-spin"></div>
                          <Zap size={32} className="absolute inset-0 m-auto text-trust-600 animate-pulse" fill="currentColor"/>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white animate-pulse">Analyzing...</h3>
                    <p className="text-slate-500 mt-2">Enhancing Image • Running OCR • Parsing Data</p>
                </div>
            )}

            {/* 3. RESULTS STATE */}
            {status === ProcessingStatus.COMPLETE && results.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-fade-in-up">
                    <div className="flex border-b border-slate-200 dark:border-slate-700">
                        {/* Sidebar List */}
                        <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <h4 className="font-bold text-slate-700 dark:text-slate-200">Scanned ({results.length})</h4>
                                <button onClick={resetScanner} className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Scan New"><Plus size={18}/></button>
                            </div>
                            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                                {results.map((res, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => setActiveResultIndex(idx)}
                                        className={`p-4 cursor-pointer border-b border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition ${idx === activeResultIndex ? 'bg-white dark:bg-slate-800 border-l-4 border-l-trust-600' : ''}`}
                                    >
                                        <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{res.vendorName}</p>
                                        <p className="text-xs text-slate-500">{res.invoiceNumber || 'No ID'} • {res.totalAmount}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 space-y-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                                <button onClick={downloadCSV} className="w-full py-2.5 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm">
                                    <FileSpreadsheet size={16} /> Export CSV / Excel
                                </button>
                                <button onClick={resetScanner} className="w-full py-2.5 bg-trust-600 text-white font-bold rounded-xl hover:bg-trust-700 transition flex items-center justify-center gap-2 text-sm shadow-md shadow-trust-600/20">
                                    <RefreshCw size={16} /> Scan Next Batch
                                </button>
                            </div>
                        </div>

                        {/* Detail View */}
                        <div className="w-2/3 p-6 bg-white dark:bg-slate-800">
                             {errorMessage && (
                                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-200 text-sm rounded-lg flex items-center gap-2">
                                    <AlertTriangle size={16}/> {errorMessage}
                                </div>
                             )}
                             {currentData && (
                                 <div className="animate-fade-in-up">
                                     <div className="flex justify-between items-start mb-6">
                                         <div>
                                             <p className="text-xs font-bold text-slate-400 uppercase">Vendor</p>
                                             <h3 className="text-xl font-bold text-slate-900 dark:text-white">{currentData.vendorName}</h3>
                                             <p className="text-sm text-slate-500 italic">{currentData.notes}</p>
                                         </div>
                                         <div className="text-right">
                                             <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
                                             <h3 className="text-2xl font-bold text-green-600">{currentData.currency || '₹'} {currentData.totalAmount}</h3>
                                         </div>
                                     </div>

                                     <div className="grid grid-cols-3 gap-4 mb-6">
                                         <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                             <p className="text-xs text-slate-500">Invoice No</p>
                                             <p className="font-mono font-semibold">{currentData.invoiceNumber || <span className="text-slate-400 italic">Not found</span>}</p>
                                         </div>
                                         <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                             <p className="text-xs text-slate-500">Date</p>
                                             <p className="font-mono font-semibold">{currentData.invoiceDate || <span className="text-slate-400 italic">Not found</span>}</p>
                                         </div>
                                         <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                             <p className="text-xs text-slate-500">GSTIN</p>
                                             <p className="font-mono font-semibold">{currentData.vendorGstin || <span className="text-slate-400 italic">Not found</span>}</p>
                                         </div>
                                     </div>

                                     <h4 className="font-bold text-sm mb-3">Line Items</h4>
                                     <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden mb-6">
                                         <table className="w-full text-sm">
                                             <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500">
                                                 <tr>
                                                     <th className="p-2 text-left">Desc</th>
                                                     <th className="p-2 text-right">Qty</th>
                                                     <th className="p-2 text-right">Total</th>
                                                 </tr>
                                             </thead>
                                             <tbody>
                                                 <tr>
                                                     <td colSpan={3} className="p-8 text-center text-slate-400">
                                                         <div className="flex flex-col items-center gap-2">
                                                            <Lock size={20} className="text-slate-300"/>
                                                            <p>Line Item Extraction is disabled in Local Mode.</p>
                                                            <p className="text-xs">Only available via Cloud AI API.</p>
                                                         </div>
                                                     </td>
                                                 </tr>
                                             </tbody>
                                         </table>
                                     </div>

                                     <div className="flex gap-2">
                                         <button onClick={() => navigator.clipboard.writeText(JSON.stringify(currentData, null, 2))} className="flex-1 py-2 border border-slate-200 dark:border-slate-600 rounded-lg font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2">
                                             <Copy size={16}/> Copy JSON
                                         </button>
                                     </div>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            )}

            {status === ProcessingStatus.ERROR && (
                <div className="text-center p-10 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-800">
                    <p className="text-red-600 font-bold mb-4">{errorMessage || "Processing Failed"}</p>
                    <button onClick={resetScanner} className="px-6 py-2 bg-white text-red-600 rounded-lg font-bold shadow hover:bg-red-50">Try Again</button>
                </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default DemoSection;