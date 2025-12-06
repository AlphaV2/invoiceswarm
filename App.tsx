import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import DemoSection from './components/DemoSection';
import InvoiceGenerator from './components/InvoiceGenerator';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import Legal from './components/Legal';
import HSNFinder from './components/HSNFinder';
import ContactForm from './components/ContactForm';
import { getUser, loginUser } from './services/storageService';
import { UserProfile } from './types';
import { FileText, Scan, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState<UserProfile>(getUser());
  
  // Theme Logic - Default to Light Mode as requested
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const handleStorageUpdate = () => {
      setCurrentUser(getUser());
    };
    window.addEventListener('storage-update', handleStorageUpdate);
    return () => window.removeEventListener('storage-update', handleStorageUpdate);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleNavigate = (page: string, sectionId?: string) => {
    if (page === 'dashboard') {
        if (!currentUser.isLoggedIn) {
            setCurrentPage('home');
            setTimeout(() => {
                document.getElementById('waitlist-form')?.scrollIntoView({behavior: 'smooth', block: 'center'});
            }, 100);
            return;
        }
        setCurrentPage('dashboard');
        window.scrollTo(0, 0);
    } else if (['privacy', 'terms', 'about', 'tool-hsn', 'contact'].includes(page)) {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    } else {
        setCurrentPage('home');
        if (sectionId) {
            setTimeout(() => {
                document.getElementById(sectionId)?.scrollIntoView({behavior: 'smooth'});
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }
    }
  };

  const handleMagicLogin = (email: string) => {
      loginUser(email);
      handleNavigate('dashboard');
  };

  const handleViewInvoice = (data: any) => {
      alert(`Viewing Invoice #${data.invoiceNumber || 'Draft'}\nVendor: ${data.vendorName}\nAmount: ${data.totalAmount}`);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-brand-500 selection:text-white bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 relative">
      <Navbar 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        onNavigate={handleNavigate} 
        user={currentUser}
      />
      
      <main>
        {currentPage === 'home' && (
            <>
                <Hero onLogin={handleMagicLogin} user={currentUser} onNavigate={handleNavigate} />
                <div id="generator"><InvoiceGenerator /></div>
                <div id="demo"><DemoSection user={currentUser} /></div>
                <Features />
                {/* Floating Action Buttons */}
                <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 animate-fade-in-up">
                    <button 
                        onClick={() => document.getElementById('generator')?.scrollIntoView({behavior: 'smooth'})}
                        className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold rounded-full shadow-xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform group"
                    >
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600">
                             <FileText size={18} />
                        </div>
                        <span className="text-sm">Invoice Generator</span>
                    </button>
                    <button 
                        onClick={() => document.getElementById('demo')?.scrollIntoView({behavior: 'smooth'})}
                        className="flex items-center gap-2 px-5 py-3 bg-trust-600 text-white font-bold rounded-full shadow-xl shadow-trust-600/30 hover:scale-105 transition-transform"
                    >
                        <div className="p-1.5 bg-white/20 rounded-full">
                            <Scan size={18} />
                        </div>
                        <span className="text-sm">OCR Scanner</span>
                    </button>
                </div>
            </>
        )}
        
        {currentPage === 'dashboard' && (
            <Dashboard 
                user={currentUser} 
                onViewInvoice={handleViewInvoice} 
                onNavigate={handleNavigate}
            />
        )}

        {currentPage === 'tool-hsn' && <HSNFinder />}
        {currentPage === 'contact' && <ContactForm onBack={() => handleNavigate('home')} />}
        {currentPage === 'privacy' && <Legal type="privacy" onBack={() => handleNavigate('home')} />}
        {currentPage === 'terms' && <Legal type="terms" onBack={() => handleNavigate('home')} />}
        {currentPage === 'about' && <Legal type="about" onBack={() => handleNavigate('home')} />}

      </main>
      
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;