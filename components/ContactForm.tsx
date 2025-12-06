import React, { useState } from 'react';
import { Send, Mail, User, MessageSquare, ArrowLeft, CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';

interface ContactFormProps {
  onBack: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      type: 'query',
      message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
        setStatus('success');
    }, 1500);
  };

  if (status === 'success') {
      return (
        <div className="pt-32 pb-20 min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="max-w-lg mx-auto px-4">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center border border-slate-200 dark:border-slate-700 animate-fade-in-up">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h2>
                    <p className="text-slate-500 mb-8">Thank you for reaching out. Our support team will get back to you at <strong>{formData.email}</strong> shortly.</p>
                    <button onClick={onBack} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-lg font-bold hover:opacity-90 transition">
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-trust-600 mb-8 transition-colors font-medium group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </button>

        <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Contact Support</h1>
            <p className="text-slate-500 dark:text-slate-400">Have a query, complaint, or feedback? We're here to help.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Your Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 outline-none focus:border-trust-500 transition-colors"
                            placeholder="John Doe"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 outline-none focus:border-trust-500 transition-colors"
                            placeholder="john@company.com"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Inquiry Type</label>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        type="button"
                        onClick={() => setFormData({...formData, type: 'query'})}
                        className={`p-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.type === 'query' ? 'bg-trust-50 border-trust-500 text-trust-700 ring-1 ring-trust-500' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
                    >
                        <HelpCircle size={18}/> General Query
                    </button>
                    <button 
                         type="button"
                         onClick={() => setFormData({...formData, type: 'complaint'})}
                         className={`p-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.type === 'complaint' ? 'bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
                    >
                        <AlertCircle size={18}/> Report Issue
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message</label>
                <div className="relative">
                    <MessageSquare className="absolute left-3 top-4 text-slate-400" size={18} />
                    <textarea 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 outline-none focus:border-trust-500 transition-colors h-32 resize-none"
                        placeholder="How can we help you?"
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-4 bg-trust-600 text-white font-bold rounded-xl shadow-lg shadow-trust-600/30 hover:bg-trust-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
                {status === 'submitting' ? 'Sending...' : <><Send size={18} /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;