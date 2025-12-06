import React from 'react';
import { Shield, FileText, Users, ArrowLeft, Lock, CheckCircle } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'about';
  onBack: () => void;
}

const Legal: React.FC<LegalPageProps> = ({ type, onBack }) => {
  const renderContent = () => {
    switch (type) {
      case 'privacy':
        return (
          <>
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600">
                 <Shield size={32} />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
            </div>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">Last Updated: October 2024</p>
              <p>At InvoiceSnap, we take your financial privacy seriously. This policy outlines how we handle your data.</p>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Information We Collect</h3>
              <p>We collect information you provide directly to us, such as when you create an account, upload invoices, or communicate with us. This includes:</p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Contact information (email address) for authentication.</li>
                <li>Financial data (invoices uploaded for processing).</li>
                <li>Usage data (features used, time spent) to improve UX.</li>
              </ul>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. How We Use Your Data</h3>
              <p>We use your data solely to provide the InvoiceSnap services. <span className="font-bold">We do NOT sell your data.</span></p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>To extract data from your uploaded documents using ephemeral AI instances.</li>
                <li>To enable your dashboard history (stored locally in your browser when possible).</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Data Retention</h3>
              <p>Uploaded images are processed in real-time and are discarded from our processing servers immediately after extraction. We do not use your invoice data to train public models.</p>
            </div>
          </>
        );
      case 'terms':
        return (
          <>
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                <FileText size={32} />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
            </div>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
              <p>Welcome to InvoiceSnap (Beta). By using our services, you agree to these terms.</p>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Beta Access</h3>
              <p>InvoiceSnap is currently in public beta. Features may change, and while we strive for stability, occasional downtime may occur.</p>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Usage Limits</h3>
              <p>Free tier users are limited to 15 invoices per month. Pro users enjoy unlimited processing subject to our fair usage policy.</p>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Accuracy Disclaimer</h3>
              <p>While our AI is highly accurate (99%+), it is not a replacement for a human accountant. You are responsible for verifying all extracted data before filing taxes or making payments. InvoiceSnap is not liable for financial losses due to OCR errors.</p>
            </div>
          </>
        );
      case 'about':
        return (
          <>
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600">
                 <Users size={32} />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">About Us</h1>
            </div>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
              <p className="text-lg leading-relaxed mb-6">
                InvoiceSnap was born out of frustration. As freelance developers and accountants, we spent hours manually typing data from PDF invoices into Excel. We knew there had to be a better way.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 my-10">
                 <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Our Mission</h3>
                    <p>To automate the boring parts of accounting so you can focus on growing your business. We believe AI should be accessible to every small business owner in India.</p>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Our Tech</h3>
                    <p>Built on the latest Gemini 2.0 Flash models, we achieve speed and accuracy that was impossible just a year ago.</p>
                 </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-trust-600 mb-8 transition-colors font-medium group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </button>
        <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 animate-fade-in-up">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Legal;