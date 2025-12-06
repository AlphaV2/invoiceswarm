import React, { useState, useEffect } from 'react';
import { ScanLine, Moon, Sun, Menu, X, LayoutDashboard, LogOut, ChevronDown, Sparkles, Lock, Clock, Home, Mail } from 'lucide-react';
import { UserProfile } from '../types';
import { logoutUser } from '../services/storageService';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  onNavigate: (page: string, sectionId?: string) => void;
  user: UserProfile;
}

const Navbar: React.FC<NavbarProps> = ({ isDark, toggleTheme, onNavigate, user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (page: string, sectionId?: string) => {
      setMobileMenuOpen(false);
      setToolsOpen(false);
      onNavigate(page, sectionId);
  };

  const handleWaitlistScroll = () => {
      setToolsOpen(false);
      setMobileMenuOpen(false);
      onNavigate('home');
      setTimeout(() => {
          document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="relative p-2 rounded-xl bg-trust-600 text-white shadow-lg shadow-trust-500/20 group-hover:scale-105 transition-transform">
              <ScanLine size={22} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              Invoice<span className="text-trust-600 dark:text-trust-400">Snap</span>
              <span className="ml-2 text-[10px] font-bold uppercase bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 px-2 py-0.5 rounded-full shadow-sm">Beta</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleLinkClick('home')} className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-trust-600 dark:text-slate-300 dark:hover:text-white transition-colors">
                <Home size={16} /> Home
            </button>
            <button onClick={() => handleLinkClick('home', 'features')} className="text-sm font-medium text-slate-600 hover:text-trust-600 dark:text-slate-300 dark:hover:text-white transition-colors">Features</button>
            
            {/* Tools Dropdown Trigger */}
            <div className="relative group">
                <button 
                    className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-trust-600 dark:text-slate-300 dark:hover:text-white transition-colors py-2"
                    onMouseEnter={() => setToolsOpen(true)}
                >
                    Tools <ChevronDown size={14} />
                </button>
                {/* Tools Dropdown Content */}
                <div 
                    className="absolute top-full -left-4 mt-0 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden hidden group-hover:block animate-fade-in-up"
                    onMouseLeave={() => setToolsOpen(false)}
                >
                    <div className="py-2">
                        <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Now</div>
                        <button onClick={() => handleLinkClick('home', 'generator')} className="block w-full text-left px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border-l-4 border-transparent hover:border-trust-500">
                            Invoice Generator
                        </button>
                        <button onClick={() => handleLinkClick('tool-hsn')} className="block w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-l-4 border-transparent hover:border-trust-500">
                            HSN Code Finder
                        </button>
                        <button onClick={() => handleLinkClick('home', 'demo')} className="block w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-l-4 border-transparent hover:border-trust-500">
                            Bulk Invoice OCR(Coming Soon)
                        </button>
                        
                        <div className="border-t border-slate-100 dark:border-slate-700 mt-2 bg-slate-50 dark:bg-slate-900/50">
                             <div className="px-4 py-2 mt-1 text-[10px] font-bold text-trust-600 uppercase tracking-wider flex items-center gap-1">
                                <Clock size={10} /> Roadmap (Join Waitlist)
                             </div>
                             <button onClick={handleWaitlistScroll} className="block w-full text-left px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex justify-between group">
                                <span>GST Validator</span> <Lock size={12} className="text-slate-400 group-hover:text-trust-500"/>
                             </button>
                             <button onClick={handleWaitlistScroll} className="block w-full text-left px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex justify-between group">
                                <span>E-Way Bill Generator</span> <Lock size={12} className="text-slate-400 group-hover:text-trust-500"/>
                             </button>
                             <button onClick={handleWaitlistScroll} className="block w-full text-left px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex justify-between group">
                                <span>GSTR-2B Reconciliation</span> <Lock size={12} className="text-slate-400 group-hover:text-trust-500"/>
                             </button>
                              <button onClick={handleWaitlistScroll} className="block w-full text-left px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex justify-between group">
                                <span>Inventory & Expense</span> <Lock size={12} className="text-slate-400 group-hover:text-trust-500"/>
                             </button>
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={() => handleLinkClick('contact')} className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-trust-600 dark:text-slate-300 dark:hover:text-white transition-colors">
                <Mail size={16} /> Contact
            </button>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user.isLoggedIn ? (
               <div className="flex items-center gap-2">
                   <button 
                     onClick={() => onNavigate('dashboard')}
                     className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
                   >
                     <LayoutDashboard size={16} /> Dashboard
                   </button>
                   <button 
                     onClick={logoutUser}
                     className="p-2 text-slate-400 hover:text-red-500 transition"
                     title="Logout"
                   >
                       <LogOut size={18} />
                   </button>
               </div>
            ) : (
               <button 
                 onClick={() => onNavigate('home', 'waitlist-form')}
                 className="group relative px-6 py-2.5 bg-trust-600 text-white rounded-full text-sm font-bold overflow-hidden shadow-lg hover:shadow-trust-500/40 transition-all"
               >
                 <span className="relative z-10 flex items-center gap-2">Join Waitlist <Sparkles size={14}/></span>
                 <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-trust-700"></div>
               </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
             <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 dark:text-slate-300">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass border-t border-slate-200 dark:border-slate-800 p-4 flex flex-col space-y-4 shadow-xl animate-fade-in-up h-screen overflow-y-auto pb-24 bg-white dark:bg-slate-900">
           <button onClick={() => handleLinkClick('home')} className="block text-left py-2 text-slate-700 dark:text-slate-200 font-medium">Home</button>
           <button onClick={() => handleLinkClick('home', 'features')} className="block text-left py-2 text-slate-700 dark:text-slate-200 font-medium">Features</button>
           <button onClick={() => handleLinkClick('contact')} className="block text-left py-2 text-slate-700 dark:text-slate-200 font-medium">Contact Us</button>

           <div className="py-2 border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
             <p className="text-xs text-slate-400 uppercase font-bold mb-3">Tools (Live)</p>
             <button onClick={() => handleLinkClick('home', 'generator')} className="block text-left py-2 text-slate-700 dark:text-slate-200 font-bold">Invoice Generator</button>
             <button onClick={() => handleLinkClick('home', 'demo')} className="block text-left py-2 text-slate-700 dark:text-slate-200">Bulk OCR Scanner</button>
             <button onClick={() => handleLinkClick('tool-hsn')} className="block text-left py-2 text-slate-700 dark:text-slate-200">HSN Finder</button>
             
             <p className="text-xs text-trust-500 uppercase font-bold mt-4 mb-2">Coming Soon (Waitlist)</p>
             <button onClick={handleWaitlistScroll} className="block text-left py-1 text-slate-500 text-sm">GST Validator</button>
             <button onClick={handleWaitlistScroll} className="block text-left py-1 text-slate-500 text-sm">E-Way Bill Generator</button>
             <button onClick={handleWaitlistScroll} className="block text-left py-1 text-slate-500 text-sm">GSTR-2B Recon</button>
           </div>
           
           {user.isLoggedIn ? (
               <>
                <button onClick={() => {onNavigate('dashboard'); setMobileMenuOpen(false)}} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-lg font-bold shadow-lg">
                    Go to Dashboard
                </button>
                <button onClick={() => {logoutUser(); setMobileMenuOpen(false)}} className="w-full text-red-500 py-2 font-medium">
                    Sign Out
                </button>
               </>
           ) : (
                <button onClick={() => handleWaitlistScroll()} className="w-full bg-trust-600 text-white py-3 rounded-lg font-bold shadow-lg">
                    Join Waitlist
                </button>
           )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;