
import React from 'react';
import { ScanLine, Mail, ArrowRight, MapPin, Clock, Lock } from 'lucide-react';

interface FooterProps {
    onNavigate: (page: string, sectionId?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToWaitlist = () => {
      onNavigate('home');
      setTimeout(() => {
          document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
  };

  return (
    <footer className="bg-[#020617] text-white pt-24 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Section */}
        <div className="relative mb-24 p-8 md:p-12 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden group hover:border-trust-900 transition-colors">
             <div className="absolute top-0 right-0 w-64 h-64 bg-trust-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-trust-600/20 transition-all"></div>
             
             <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-xl text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-trust-900/50 text-trust-400 text-xs font-bold uppercase tracking-wide mb-3 border border-trust-800">
                        <Clock size={12} /> Roadmap Update
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">Join the MVP Waitlist</h3>
                    <p className="text-slate-400">Get early access to <span className="text-white">GSTR-2B Reconciliation</span>, <span className="text-white">E-Way Bill Generation</span>, and <span className="text-white">Inventory Sync</span>. 500 spots only.</p>
                </div>
                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                    <button onClick={scrollToWaitlist} className="w-full sm:w-auto bg-trust-600 hover:bg-trust-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-trust-900/20 flex items-center justify-center gap-2 whitespace-nowrap">
                        Join Waitlist Now <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-20">
          <div className="col-span-2 lg:col-span-2 pr-8">
            <div className="flex items-center space-x-2 mb-6 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="p-1.5 bg-trust-600 rounded-lg text-white shadow-lg shadow-trust-900/50">
                <ScanLine size={24} />
              </div>
              <span className="font-bold text-2xl tracking-tight">
                Invoice<span className="text-trust-400">Snap</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Automating the last mile of accounting for Indian businesses. We extract, organize, and validate GST data instantly using AI.
            </p>
            <div className="space-y-3">
                <a href="mailto:hemantgoshika3@gmail.com" className="flex items-center gap-3 text-slate-400 text-sm hover:text-white transition">
                   <Mail size={16} className="text-trust-500 shrink-0"/> Contact Support
                </a>
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                   <MapPin size={16} className="text-trust-500 shrink-0"/> Hyderabad, India
                </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Live Tools</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={() => onNavigate('home', 'generator')} className="hover:text-trust-400 transition hover:translate-x-1 inline-block text-white font-medium">Invoice Generator</button></li>
              <li><button onClick={() => onNavigate('tool-hsn')} className="hover:text-trust-400 transition hover:translate-x-1 inline-block">AI HSN Finder</button></li>
              <li><button onClick={() => onNavigate('home', 'demo')} className="hover:text-trust-400 transition hover:translate-x-1 inline-block">Bulk OCR Demo</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-trust-400 mb-6 flex items-center gap-2">Upcoming <Lock size={12}/></h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><button onClick={scrollToWaitlist} className="hover:text-white transition hover:translate-x-1 inline-block text-left">GST Validator</button></li>
              <li><button onClick={scrollToWaitlist} className="hover:text-white transition hover:translate-x-1 inline-block text-left">E-Way Bill Gen</button></li>
              <li><button onClick={scrollToWaitlist} className="hover:text-white transition hover:translate-x-1 inline-block text-left">GSTR-2B Recon</button></li>
              <li><button onClick={scrollToWaitlist} className="hover:text-white transition hover:translate-x-1 inline-block text-left">Inventory Sync</button></li>
              <li><button onClick={scrollToWaitlist} className="hover:text-white transition hover:translate-x-1 inline-block text-left">Expense Tracker</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-trust-400 transition hover:translate-x-1 inline-block">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('terms')} className="hover:text-trust-400 transition hover:translate-x-1 inline-block">Terms of Service</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-trust-400 transition hover:translate-x-1 inline-block">About Us</button></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
              <p className="text-xs text-slate-500">
                © 2024 InvoiceSnap Inc.
              </p>
              <span className="hidden md:inline text-slate-700">|</span>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  Developed and maintained by <span className="font-bold text-trust-400">InterXect Labs</span>
              </p>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Systems Normal
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
