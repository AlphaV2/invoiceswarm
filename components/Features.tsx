
import React from 'react';
import { Zap, FileSpreadsheet, Layers, Smartphone, Globe, CreditCard, PieChart, Truck, FileText, Search, Package, Lock, ShieldCheck } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white dark:bg-dark-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-sm text-trust-600 dark:text-trust-400 font-bold tracking-wide uppercase mb-2">The Masterplan</h2>
          <p className="text-3xl md:text-5xl leading-tight font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            Not just an OCR tool. <br/> Your future <span className="text-trust-600">Financial OS.</span>
          </p>
          <p className="text-slate-500 max-w-2xl mx-auto">
              We are rolling out features in phases. Join the waitlist to get notified when new modules drop.
          </p>
        </div>

        {/* Phase 1: Live Now */}
        <div className="mb-20">
           <div className="flex items-center gap-4 mb-8">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 uppercase tracking-wide">Phase 1: Live Now</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Core Automation</h3>
           </div>
           <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<FileText className="text-purple-500" />}
                title="Invoice Generator"
                desc="Create professional, GST-compliant PDFs instantly. No signup required."
              />
              <FeatureCard 
                icon={<Zap className="text-yellow-500" />}
                title="AI Invoice OCR"
                desc="Extract vendor, tax, and line items in <5 seconds. 99% accuracy on Indian invoices."
              />
              <FeatureCard 
                icon={<Search className="text-blue-500" />}
                title="AI HSN Finder"
                desc="Find the correct HSN code and GST rate by just describing your product."
              />
           </div>
        </div>

        {/* Phase 2: Next 60 Days */}
        <div className="mb-20">
           <div className="flex items-center gap-4 mb-8">
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200 uppercase tracking-wide">Phase 2: Development (Join Waitlist)</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Compliance Suite</h3>
           </div>
           <div className="grid md:grid-cols-3 gap-8 opacity-90">
              <FeatureCard 
                icon={<ShieldCheck className="text-green-600" />}
                title="GST Validator"
                desc="Bulk verify GSTINs to prevent ITC loss. Check filing status instantly."
                comingSoon
              />
               <FeatureCard 
                icon={<Truck className="text-orange-500" />}
                title="E-Way Bill Auto-Gen"
                desc="Auto-generate E-Way bills for invoices > ₹50,000. One click integration."
                comingSoon
              />
              <FeatureCard 
                icon={<PieChart className="text-pink-500" />}
                title="GSTR-2B Recon"
                desc="Auto-match GSTR-2B with your purchase register. Identify missing credits in seconds."
                comingSoon
              />
           </div>
        </div>

        {/* Phase 3: Enterprise */}
        <div className="relative">
           <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-dark-bg z-10 h-full w-full pointer-events-none"></div>
           <div className="flex items-center gap-4 mb-8">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200 uppercase tracking-wide">Phase 3: Ecosystem</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Full Business OS</h3>
           </div>
           <div className="grid md:grid-cols-3 gap-8 blur-[1px] grayscale-[50%] hover:grayscale-0 hover:blur-none transition-all duration-500">
              <FeatureCard 
                icon={<Package className="text-indigo-500" />}
                title="Inventory Sync"
                desc="Auto-deduct stock based on invoices generated. Low stock alerts."
                comingSoon
              />
              <FeatureCard 
                icon={<Globe className="text-sky-500" />}
                title="Auditor Portal"
                desc="Give read-only access to your CA for filing taxes. No more emailing zip files."
                comingSoon
              />
              <FeatureCard 
                icon={<Smartphone className="text-slate-500" />}
                title="Expense Tracker"
                desc="Scan receipts on the go. Auto-categorize expenses for tax saving."
                comingSoon
              />
           </div>
        </div>
        
      </div>
    </section>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, desc: string, comingSoon?: boolean}> = ({ icon, title, desc, comingSoon }) => (
  <div className="relative p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-trust-300 dark:hover:border-trust-700 transition-all hover:shadow-lg group">
    {comingSoon && (
      <div className="absolute top-4 right-4 px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300 rounded flex items-center gap-1">
        <Lock size={10} /> Waitlist
      </div>
    )}
    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 24 })}
    </div>
    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Features;
