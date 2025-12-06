import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck, Clock, FileText, Sparkles, Loader2, Lock } from 'lucide-react';

const Hero: React.FC<{onLogin: (email: string) => void, user: any, onNavigate: any}> = ({ onLogin, user, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [joinedCount, setJoinedCount] = useState(2347);
  const [submitted, setSubmitted] = useState(false);

  // Animate the counter slightly
  useEffect(() => {
    const interval = setInterval(() => {
        setJoinedCount(prev => prev + Math.floor(Math.random() * 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- THIS IS THE FIXED SECTION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);

    try {
        // 1. Send data to the Vercel/Upstash backend
        const response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        // 2. Handle the result
        if (response.ok) {
            setSubmitted(true);
            setEmail(''); 
        } else {
            alert("Something went wrong. Please try again.");
        }
    } catch (error) {
        console.error("Waitlist error:", error);
        alert("Connection failed. Please check your internet.");
    } finally {
        setLoading(false);
    }
  };
  // --------------------------------

  return (
    <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-24 overflow-hidden selection:bg-trust-500 selection:text-white">
      {/* Soft Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute -top-[10%] left-[20%] w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-900/10 rounded-full blur-[120px] animate-float"></div>
         <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-sky-400/10 dark:bg-sky-900/10 rounded-full blur-[100px] animate-blob"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Content */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            
            {/* Early Access Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-sm font-semibold mb-6 shadow-sm backdrop-blur-sm animate-fade-in-up cursor-pointer hover:scale-105 transition-transform">
               <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
               <span className="text-amber-800 dark:text-amber-200">Early Access: Join <span className="font-bold">{joinedCount.toLocaleString()}</span> others</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
              India's Best <span className="text-trust-600">Free Invoice Generator</span>
              <br className="hidden lg:block"/> & Automation Suite.
            </h1>
            
            {/* Subheadline */}
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-xl mb-8 leading-relaxed">
               Create professional GST invoices in seconds. <br/>
               <span className="font-bold text-slate-900 dark:text-white">No Signup. No Credit Card. Free Forever.</span>
            </p>

            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-fade-in-up w-full justify-center lg:justify-start">
                <button 
                    onClick={() => document.getElementById('generator')?.scrollIntoView({behavior: 'smooth'})}
                    className="px-8 py-4 bg-trust-600 text-white font-bold rounded-xl shadow-xl shadow-trust-600/30 hover:bg-trust-700 hover:scale-105 transition flex items-center justify-center gap-2 text-lg w-full sm:w-auto"
                >
                    <FileText size={22} /> Generate Invoice Now
                </button>
                {/* <button 
                    onClick={() => document.getElementById('demo')?.scrollIntoView({behavior: 'smooth'})}
                    className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2 text-lg w-full sm:w-auto"
                >
                    Try OCR Demo
                </button> */}
            </div>

            {/* Proof Strip */}
            <div className="w-full border-t border-slate-200 dark:border-slate-800 pt-6">
               <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-8 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><Check size={14} className="text-green-500"/> Instant PDF</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-500"/> No Data Stored</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-green-500"/> Free Forever</span>
               </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Waitlist Card */}
          <div className="flex justify-center lg:justify-end w-full animate-fade-in-up delay-100">
             <div id="waitlist-form" className="relative w-full max-w-md group">
                 {/* Glowing Gradient Background Layer */}
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-fast"></div>
                 
                 {/* Glass Card Container */}
                 <div className="relative w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/50 dark:border-slate-700/50">
                     {!submitted ? (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Header */}
                            <div className="text-center mb-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
                                   <Sparkles size={12} fill="currentColor" /> Coming Soon
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Get Early Access to AI Tools</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                   Join the waitlist for <span className="font-semibold text-slate-700 dark:text-slate-200">Bulk OCR, GST Validator & GSTR-2B Recon.</span>
                                </p>
                            </div>
                            
                            {/* Input Area */}
                            <div className="space-y-3">
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address..."
                                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                                />
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2 transform active:scale-95"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20}/> : <>Join the Waitlist <Lock size={16}/></>}
                                </button>
                            </div>
                            
                            {/* Footer */}
                            <div className="text-center pt-2">
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 font-medium">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    {joinedCount.toLocaleString()} people waiting for launch.
                                </p>
                            </div>
                        </form>
                     ) : (
                         // Success State
                        <div className="py-8 px-4 text-center bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30 animate-blob">
                                <Check size={32} strokeWidth={3} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">You're on the list!</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">We'll notify you when AI OCR features go live. <br/>In the meantime, enjoy the free generator.</p>
                        </div>
                     )}
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;