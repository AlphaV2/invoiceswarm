import React, { useEffect, useState, useMemo } from 'react';
import { getHistory, getUser, clearHistory } from '../services/storageService';
import { InvoiceHistoryItem, UserProfile } from '../types';
import { FileSpreadsheet, Crown, Search, TrendingUp, Trash2 } from 'lucide-react';

interface DashboardProps {
    user: UserProfile;
    onViewInvoice: (data: any) => void;
    onNavigate: (page: string, sectionId?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onViewInvoice, onNavigate }) => {
  const [history, setHistory] = useState<InvoiceHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch history on mount and listen for updates
  useEffect(() => {
    setHistory(getHistory());
    
    const handleHistoryUpdate = () => {
      setHistory(getHistory());
    };
    
    window.addEventListener('history-update', handleHistoryUpdate);
    return () => window.removeEventListener('history-update', handleHistoryUpdate);
  }, []);

  const filteredHistory = useMemo(() => history.filter(item => 
    item.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [history, searchTerm]);

  const totalValue = useMemo(() => history.reduce((acc, curr) => {
      const val = parseFloat(curr.amount.replace(/[^0-9.-]+/g,""));
      return acc + (isNaN(val) ? 0 : val);
  }, 0), [history]);

  const exportToCSV = () => {
    if (history.length === 0) {
        alert("No invoices to export.");
        return;
    }
    const headers = ["Date", "Vendor", "Invoice No", "Total", "CGST", "SGST", "IGST", "Status"];
    const rows = history.map(h => [
      h.date,
      `"${h.vendor}"`,
      h.data?.invoiceNumber || '-',
      h.amount,
      h.data?.cgst || '0',
      h.data?.sgst || '0',
      h.data?.igst || '0',
      h.status
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `invoicesnap_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearHistory = () => {
      if(confirm("Are you sure you want to delete all invoice history? This cannot be undone.")) {
          clearHistory();
      }
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">Welcome back, {user.email || 'Guest'}</p>
          </div>
          <div className="flex flex-wrap gap-3">
             {!user.isPro ? (
               <button 
                 onClick={() => onNavigate('home', 'pricing')}
                 className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition"
               >
                 <Crown size={18} /> Upgrade to Lifetime
               </button>
             ) : (
               <span className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold">
                 <Crown size={16} className="text-amber-500" /> Pro Member
               </span>
             )}
             <button 
               onClick={exportToCSV}
               className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-md transition"
             >
               <FileSpreadsheet size={18} /> Export to Sheets
             </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <div>
                   <p className="text-xs font-bold text-slate-400 uppercase">Total Invoices</p>
                   <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{history.length}</h3>
                 </div>
                 <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg"><TrendingUp size={20} /></div>
              </div>
              <p className="text-xs text-green-600 font-medium">+12% from last month</p>
           </div>
           
           <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <div>
                   <p className="text-xs font-bold text-slate-400 uppercase">Credits Left</p>
                   <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{user.isPro ? '∞' : (user.maxCredits - user.creditsUsed)}</h3>
                 </div>
                 <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg"><Crown size={20} /></div>
              </div>
              {!user.isPro && (
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2">
                   <div className="h-full bg-trust-600 rounded-full" style={{width: `${(user.creditsUsed/user.maxCredits)*100}%`}}></div>
                </div>
              )}
           </div>

           <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <div>
                   <p className="text-xs font-bold text-slate-400 uppercase">Total Value</p>
                   <h3 className="text-3xl font-bold text-slate-900 dark:text-white">₹{totalValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</h3>
                 </div>
                 <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">₹</div>
              </div>
           </div>
        </div>

        {/* Recent Invoices Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
           <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between gap-4 items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Invoices</h3>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                    type="text" 
                    placeholder="Search vendor..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-trust-500"
                    />
                </div>
                {history.length > 0 && (
                    <button onClick={handleClearHistory} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Clear All History">
                        <Trash2 size={18} />
                    </button>
                )}
              </div>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-medium">
                 <tr>
                   <th className="px-6 py-4">Date</th>
                   <th className="px-6 py-4">Vendor</th>
                   <th className="px-6 py-4">Amount</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                 {filteredHistory.length > 0 ? filteredHistory.map((item) => (
                   <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                     <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                         {new Date(item.date).toLocaleDateString('en-IN')}
                         {item.source === 'GENERATOR' && <span className="ml-2 text-[10px] bg-slate-200 dark:bg-slate-700 px-1 rounded text-slate-500">GEN</span>}
                     </td>
                     <td className="px-6 py-4 font-medium text-slate-900 dark:text-white max-w-[200px] truncate">{item.vendor}</td>
                     <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{item.amount}</td>
                     <td className="px-6 py-4">
                       <span className={`px-2 py-1 text-xs rounded-full font-bold ${item.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                           {item.status}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                       <button onClick={() => onViewInvoice(item.data)} className="text-trust-600 hover:text-trust-800 font-medium">View Data</button>
                     </td>
                   </tr>
                 )) : (
                   <tr>
                     <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                        {searchTerm ? "No matching invoices found." : (
                            <>
                                No invoices found. <br/>
                                <button onClick={() => onNavigate('home', 'demo')} className="text-trust-600 hover:underline mt-2 font-medium">Process your first invoice now!</button>
                            </>
                        )}
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;