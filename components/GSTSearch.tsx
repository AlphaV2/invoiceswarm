import React, { useState } from 'react';
import { Search, Loader2, CheckCircle, XCircle, Building2, Clock } from 'lucide-react';

const GSTSearch: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 opacity-60 pointer-events-none grayscale">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wide mb-4">
           <Clock size={14} /> Coming Soon
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Verify Any GSTIN Instantly</h2>
        <p className="text-slate-500 mb-8">This feature is currently under maintenance for the Beta period.</p>
        
        <div className="relative max-w-lg mx-auto mb-8">
          <input 
            type="text" 
            placeholder="Enter GSTIN (e.g. 27AAAAA0000A1Z5)"
            disabled
            className="w-full pl-6 pr-32 py-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
          />
          <button 
            disabled
            className="absolute right-2 top-2 bottom-2 bg-slate-400 text-white px-6 rounded-lg font-bold"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default GSTSearch;