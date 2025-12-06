import React, { useState } from 'react';
import { Check, Star, Shield, Zap, Lock, Crown } from 'lucide-react';
import { upgradeUser } from '../services/storageService';

const Pricing: React.FC = () => {
  const [billing, setBilling] = useState<'MONTHLY' | 'LIFETIME'>('LIFETIME');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'PRO_MONTHLY' | 'LIFETIME'>('LIFETIME');

  const handleUpgrade = (plan: 'PRO_MONTHLY' | 'LIFETIME') => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    // Simulating Razorpay Success
    setTimeout(() => {
      upgradeUser(selectedPlan);
      window.location.reload(); // Reload to reflect state changes
    }, 1500);
  };

  return (
    <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Payment Modal Simulation */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4 animate-fade-in-up">
              <h3 className="text-xl font-bold mb-4">Complete Payment</h3>
              <p className="text-sm text-gray-500 mb-6">Simulating Razorpay Secure Payment Gateway...</p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                 <div className="flex justify-between font-bold mb-2">
                   <span>{selectedPlan === 'LIFETIME' ? 'Lifetime Access' : 'Pro Monthly'}</span>
                   <span>{selectedPlan === 'LIFETIME' ? '₹1,999' : '₹799'}</span>
                 </div>
                 <div className="flex justify-between text-xs text-gray-500">
                   <span>GST (18%)</span>
                   <span>{selectedPlan === 'LIFETIME' ? '₹360' : '₹144'}</span>
                 </div>
                 <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between font-bold text-lg">
                   <span>Total</span>
                   <span>{selectedPlan === 'LIFETIME' ? '₹2,359' : '₹943'}</span>
                 </div>
              </div>
              <button onClick={processPayment} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg mb-3 flex justify-center gap-2">
                 Pay Now
              </button>
              <button onClick={() => setShowPaymentModal(false)} className="w-full py-2 text-gray-500 font-medium hover:text-gray-700">Cancel</button>
           </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
            Fair Pricing for <span className="text-trust-600">Indian Business</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Stop paying $29/month for foreign tools. Get GST-ready automation at Indian prices.
          </p>

          <div className="flex justify-center mb-12">
            <div className="bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 inline-flex shadow-sm">
               <button 
                 onClick={() => setBilling('MONTHLY')}
                 className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${billing === 'MONTHLY' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500'}`}
               >
                 Monthly
               </button>
               <button 
                 onClick={() => setBilling('LIFETIME')}
                 className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${billing === 'LIFETIME' ? 'bg-trust-600 text-white shadow-md' : 'text-slate-500'}`}
               >
                 <Zap size={14} className="fill-current" /> Lifetime Deal
               </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Free Plan */}
          <div className="relative bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover:border-trust-300 transition-all group">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Free Forever</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">For freelancers & students.</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹0</span>
            </div>
            <button className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition mb-8">
              Current Plan
            </button>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <FeatureItem text="15 Invoices / month" />
              <FeatureItem text="Basic GST Extraction" />
              <FeatureItem text="Download as Excel/CSV" />
              <FeatureItem text="No Login Required" />
            </ul>
          </div>

          {/* Pro / Lifetime Plan - Best Value */}
          <div className="relative bg-gradient-to-br from-trust-600 to-sky-700 text-white rounded-2xl p-8 shadow-2xl transform scale-105 z-10 border border-trust-400">
            <div className="absolute top-0 right-0 bg-yellow-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg flex items-center gap-1">
              <Star size={12} fill="currentColor" /> MOST POPULAR
            </div>
            <h3 className="text-xl font-bold mb-2">Pro {billing === 'LIFETIME' ? 'Lifetime' : 'Monthly'}</h3>
            <p className="text-trust-100 text-sm mb-6">For growing CAs & firms.</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-extrabold">
                 {billing === 'LIFETIME' ? '₹1,999' : '₹799'}
              </span>
              <span className="text-trust-100 text-sm">{billing === 'LIFETIME' ? '/once' : '/mo'}</span>
            </div>
            {billing === 'LIFETIME' && (
               <div className="text-xs bg-white/20 inline-block px-2 py-1 rounded mb-6 font-medium">
                  Use forever. Pay once. Save ₹9,000/yr
               </div>
            )}
            <button 
              onClick={() => handleUpgrade(billing === 'LIFETIME' ? 'LIFETIME' : 'PRO_MONTHLY')}
              className="w-full py-3 px-4 bg-white text-trust-600 font-bold rounded-xl hover:bg-trust-50 transition mb-8 shadow-lg flex items-center justify-center gap-2"
            >
              <Zap size={18} /> {billing === 'LIFETIME' ? 'Get Lifetime Access' : 'Upgrade Now'}
            </button>
            <ul className="space-y-4 text-sm text-white">
              <FeatureItem text="Unlimited Invoices" light />
              <FeatureItem text="Sync with Tally/Zoho" light />
              <FeatureItem text="Bulk Upload (50 files)" light />
              <FeatureItem text="Priority Email Support" light />
              <FeatureItem text="Google Sheets Export" light />
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="relative bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover:border-trust-300 transition-all group">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Enterprise</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">For large accounting firms.</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                 {billing === 'LIFETIME' ? '₹5,999' : '₹2,999'}
              </span>
              <span className="text-slate-500 text-sm">{billing === 'LIFETIME' ? '/once' : '/mo'}</span>
            </div>
            <button className="w-full py-3 px-4 bg-slate-900 dark:bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition mb-8">
              Contact Sales
            </button>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <FeatureItem text="White-Label Portal" />
              <FeatureItem text="API Access" />
              <FeatureItem text="Multi-User (10 Seats)" />
              <FeatureItem text="Audit Logs" />
              <FeatureItem text="Dedicated Manager" />
            </ul>
          </div>

        </div>

        {/* Guarantee */}
        <div className="mt-16 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 text-sm font-medium">
             <Shield size={16} className="text-trust-600" /> 100% Secure Payment via Razorpay. 30-Day Refund Policy.
           </div>
        </div>
      </div>
    </section>
  );
};

const FeatureItem: React.FC<{text: string, light?: boolean}> = ({ text, light }) => (
  <li className="flex items-start gap-3">
    <div className={`mt-0.5 p-0.5 rounded-full ${light ? 'bg-trust-500 text-white' : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'}`}>
       <Check size={12} strokeWidth={3} />
    </div>
    <span className="font-medium">
      {text}
    </span>
  </li>
);

export default Pricing;