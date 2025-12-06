import React, { useState, useEffect } from 'react';
import { Calculator, IndianRupee, PieChart, Info } from 'lucide-react';

const SalaryCalculator: React.FC = () => {
  const [ctc, setCtc] = useState<number>(1200000);
  const [breakdown, setBreakdown] = useState<any>(null);

  useEffect(() => {
    calculateSalary();
  }, [ctc]);

  const calculateSalary = () => {
    // Simplified Indian Salary Structure Logic
    const monthlyCTC = ctc / 12;
    const basic = monthlyCTC * 0.5; // 50% of CTC
    const hra = basic * 0.4; // 40% of Basic
    const pf = Math.min(basic * 0.12, 1800); // PF Cap
    const professionalTax = 200;
    
    // Tax Calculation (New Regime Simplified)
    let taxableIncome = ctc - (pf * 12) - 75000; // Standard deduction
    if (taxableIncome < 0) taxableIncome = 0;

    let annualTax = 0;
    
    // New Regime Slabs (FY 2024-25 approx)
    if (taxableIncome > 300000) annualTax += (Math.min(taxableIncome, 700000) - 300000) * 0.05;
    if (taxableIncome > 700000) annualTax += (Math.min(taxableIncome, 1000000) - 700000) * 0.10;
    if (taxableIncome > 1000000) annualTax += (Math.min(taxableIncome, 1200000) - 1000000) * 0.15;
    if (taxableIncome > 1200000) annualTax += (Math.min(taxableIncome, 1500000) - 1200000) * 0.20;
    if (taxableIncome > 1500000) annualTax += (taxableIncome - 1500000) * 0.30;
    
    // Rebate u/s 87A if income <= 7L
    if (taxableIncome <= 700000) annualTax = 0;

    const monthlyTax = annualTax / 12;
    const specialAllowance = monthlyCTC - basic - hra - pf;
    const inHand = monthlyCTC - pf - professionalTax - monthlyTax;

    setBreakdown({
      monthlyCTC,
      basic,
      hra,
      pf,
      professionalTax,
      monthlyTax,
      specialAllowance,
      inHand
    });
  };

  return (
    <section className="pt-32 pb-24 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wide mb-4">
             <Calculator size={14} /> Free Tool
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            In-Hand Salary Calculator
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Estimate your monthly take-home pay based on New Tax Regime (FY 2024-25).
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
           {/* Input Section */}
           <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Annual CTC (₹)</label>
              <div className="relative mb-6">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="number" 
                  value={ctc}
                  onChange={(e) => setCtc(Number(e.target.value))}
                  step="5000"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-lg focus:ring-2 focus:ring-trust-500 outline-none"
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                 <Info size={16} className="mt-0.5 shrink-0"/>
                 <p><strong>Note:</strong> Standard Deduction of ₹75,000 is applied. PF is capped at ₹1800. Professional tax ₹200/mo.</p>
              </div>
           </div>

           {/* Result Section */}
           <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in-up">
              {breakdown && (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-trust-600 to-trust-500 p-8 rounded-xl text-white mb-8 shadow-xl shadow-trust-500/20">
                     <div>
                        <p className="text-trust-100 text-sm font-medium mb-1 uppercase tracking-wider">Estimated Monthly In-Hand</p>
                        <h2 className="text-5xl font-bold">₹ {breakdown.inHand.toLocaleString('en-IN', {maximumFractionDigits: 0})}</h2>
                     </div>
                     <div className="mt-6 md:mt-0 px-5 py-3 bg-white/10 rounded-xl text-sm font-semibold backdrop-blur-sm border border-white/10">
                        Annual Net: ₹ {(breakdown.inHand * 12).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                     </div>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 text-lg">
                     <PieChart size={20} className="text-trust-600" /> Salary Breakdown (Monthly)
                  </h3>
                  
                  <div className="space-y-4">
                     <SalaryRow label="Basic Salary" value={breakdown.basic} />
                     <SalaryRow label="HRA (House Rent Allowance)" value={breakdown.hra} />
                     <SalaryRow label="Special Allowance" value={breakdown.specialAllowance} />
                     <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                     <SalaryRow label="Gross Salary" value={breakdown.monthlyCTC} isBold />
                     
                     <div className="mt-8 mb-4 text-xs font-bold text-red-500 uppercase tracking-wide">Deductions</div>
                     <SalaryRow label="Provident Fund (PF)" value={breakdown.pf} isDeduction />
                     <SalaryRow label="Professional Tax" value={breakdown.professionalTax} isDeduction />
                     <SalaryRow label="Income Tax (TDS Estimate)" value={breakdown.monthlyTax} isDeduction />
                  </div>
                </>
              )}
           </div>
        </div>
      </div>
    </section>
  );
};

const SalaryRow: React.FC<{label: string, value: number, isBold?: boolean, isDeduction?: boolean}> = ({ label, value, isBold, isDeduction }) => (
  <div className={`flex justify-between items-center p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700/50 transition ${isBold ? 'font-bold text-lg text-slate-900 dark:text-white' : 'text-sm text-slate-600 dark:text-slate-300'}`}>
     <span>{label}</span>
     <span className={`font-mono ${isDeduction ? 'text-red-500' : ''}`}>
       {isDeduction && '- '}₹ {value.toLocaleString('en-IN', {maximumFractionDigits: 0})}
     </span>
  </div>
);

export default SalaryCalculator;