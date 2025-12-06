import React, { useState } from 'react';
import { Search, Loader2, Tag, Percent, Info, ArrowRight } from 'lucide-react';
import { identifyHSN } from '../services/geminiService';

const HSNFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ hsnCode: string; gstRate: string; description: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);
    setSearched(true);

    try {
      const data = await identifyHSN(query);
      setResults(data);
      if (data.length === 0) setError("No matching HSN codes found. Try a different keyword.");
    } catch (err) {
      setError("Failed to fetch HSN codes. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-32 pb-24 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wide mb-4">
             <Tag size={14} /> Free AI Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Smart HSN Code Finder
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Don't guess. Describe your product in plain English, and our AI will find the correct HSN and GST rate instantly.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-12 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="absolute left-6 text-slate-400" size={20} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Leather handbags, Steel pipes, Web hosting..."
              className="w-full pl-14 pr-32 py-4 rounded-xl bg-transparent text-slate-900 dark:text-white text-lg placeholder:text-slate-400 focus:outline-none"
            />
            <button 
              type="submit" 
              disabled={loading || !query}
              className="absolute right-2 px-6 py-2.5 bg-trust-600 hover:bg-trust-700 text-white font-bold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-trust-500/30"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><span className="hidden sm:inline">Find Code</span><ArrowRight size={20}/></>}
            </button>
          </form>
        </div>

        {!searched && (
            <div className="text-center">
                <p className="text-sm text-slate-400 mb-4">Popular Searches:</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {['Mobile Phones', 'Cement', 'Software Services', 'Cotton Shirt', 'Laptops'].map(term => (
                        <button key={term} onClick={() => {setQuery(term); document.querySelector('form')?.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}))}} className="px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 hover:border-trust-400 transition">
                            {term}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {loading && (
            <div className="text-center py-12">
                <Loader2 size={40} className="text-trust-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-500 animate-pulse">Analyzing GST Database...</p>
            </div>
        )}

        {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center font-medium mb-8 animate-fade-in-up">
                {error}
            </div>
        )}

        {results.length > 0 && (
          <div className="grid md:grid-cols-1 gap-4 animate-fade-in-up max-w-2xl mx-auto">
            <h3 className="text-slate-500 font-medium mb-2">Top Matches</h3>
            {results.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:border-trust-400 transition-all flex items-center justify-between group">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-2xl font-bold text-trust-600 dark:text-trust-400">{item.hsnCode}</span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded">GST: {item.gstRate}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{item.description}</p>
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(item.hsnCode)}
                  className="p-2 text-slate-400 hover:text-trust-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                  title="Copy HSN"
                >
                    <Tag size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HSNFinder;