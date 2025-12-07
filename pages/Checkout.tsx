import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/mockBackend';

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contractId, setContractId] = useState<string | null>(null);
  
  const freelancerName = location.state?.freelancerName || 'Freelancer';
  const amount = location.state?.amount || 'Rs 1500';
  const jobId = location.state?.jobId || 'mock_job_id';

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate API call to backend
    const newContractId = await api.hireFreelancer(jobId, freelancerName, amount);
    setContractId(newContractId);
    setIsProcessing(false);
    setIsPaid(true);
  };

  if (isPaid) {
      return (
        <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                    <i className="fas fa-check"></i>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
                <p className="text-slate-500 mb-8">You have successfully hired <strong>{freelancerName}</strong>. A contract has been created.</p>
                <div className="space-y-3">
                    <button onClick={() => navigate(`/contract/${contractId}`)} className="block w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg">Go to Workroom</button>
                    <Link to="/client-dashboard" className="block w-full bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">Return to Dashboard</Link>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20">
      <header className="bg-white/95 backdrop-blur sticky top-0 z-50 px-6 py-4 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link to="/client-dashboard" className="flex items-center gap-3 text-indigo-600 group">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">S</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Skillora</span>
          </Link>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium bg-slate-100 px-3 py-1.5 rounded-full">
            <i className="fas fa-lock text-green-600"></i>
            <span>Secure 256-bit SSL Encrypted Payment</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="mb-8">
            <nav className="flex text-sm font-medium text-slate-500 mb-2">
                <Link to="/client-dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
                <span className="mx-2">/</span>
                <span className="text-slate-900 font-bold">Checkout</span>
            </nav>
            <h1 className="text-3xl font-bold text-slate-900">Review & Pay</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-slate-100">
                     <h2 className="text-lg font-bold text-slate-900">Payment Method</h2>
                 </div>
                 <div className="p-6">
                     <div className="grid grid-cols-2 gap-4 mb-6">
                         <label className="cursor-pointer">
                             <input type="radio" name="payment_method" className="peer sr-only" defaultChecked />
                             <div className="h-full border-2 border-indigo-600 bg-indigo-50/50 rounded-xl p-4 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:shadow-sm border-slate-200 hover:border-indigo-300 transition-all flex flex-col items-center justify-center gap-2 text-center">
                                 <div className="text-indigo-600 text-xl"><i className="fas fa-credit-card"></i></div>
                                 <div className="font-bold text-slate-900 text-sm">Credit Card</div>
                             </div>
                         </label>
                         <label className="cursor-pointer">
                             <input type="radio" name="payment_method" className="peer sr-only" />
                             <div className="h-full border-2 border-slate-100 bg-white rounded-xl p-4 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:shadow-sm hover:border-indigo-300 transition-all flex flex-col items-center justify-center gap-2 text-center">
                                 <div className="text-slate-400 text-xl"><i className="fab fa-paypal"></i></div>
                                 <div className="font-bold text-slate-900 text-sm">PayPal</div>
                             </div>
                         </label>
                     </div>

                     <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                         <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Card Number</label>
                             <div className="relative border border-slate-200 rounded-lg p-3 bg-white flex items-center gap-3">
                                 <i className="far fa-credit-card text-slate-400"></i>
                                 <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-transparent outline-none text-slate-800 font-mono font-medium"/>
                             </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Expiration</label>
                                <div className="relative border border-slate-200 rounded-lg p-3 bg-white">
                                    <input type="text" placeholder="MM / YY" className="w-full bg-transparent outline-none text-slate-800 font-mono font-medium"/>
                                </div>
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex justify-between">
                                    <span>CVC</span>
                                </label>
                                <div className="relative border border-slate-200 rounded-lg p-3 bg-white">
                                    <input type="text" placeholder="123" className="w-full bg-transparent outline-none text-slate-800 font-mono font-medium"/>
                                </div>
                             </div>
                         </div>
                     </form>
                 </div>
             </div>
          </div>

          <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                          <h3 className="font-bold text-slate-900">Order Summary</h3>
                      </div>
                      <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                        <img src="https://i.pravatar.cc/150?u=ella_pro" className="w-12 h-12 rounded-xl object-cover border border-slate-200" alt="Freelancer"/>
                        <div>
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Paying To</div>
                            <div className="font-bold text-slate-900">{freelancerName}</div>
                            <div className="text-xs text-slate-500">Contract Payment</div>
                        </div>
                      </div>
                      <div className="p-6 space-y-3">
                          <div className="flex justify-between text-sm text-slate-600">
                              <span>Milestone 1</span>
                              <span className="font-bold text-slate-900">{amount}</span>
                          </div>
                          <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-end">
                              <span className="font-bold text-slate-900">Total</span>
                              <span className="text-2xl font-extrabold text-indigo-600">{amount}</span>
                          </div>
                      </div>
                      <div className="p-6 pt-0">
                          <button 
                            onClick={handlePay}
                            disabled={isProcessing}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                          >
                             {isProcessing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-lock"></i>}
                             {isProcessing ? 'Processing...' : `Pay ${amount} Now`}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;