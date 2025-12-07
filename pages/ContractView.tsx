import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/mockBackend';
import { Contract } from '../types';

const ContractView: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    const fetchContract = async () => {
        if(!contractId) return;
        const data = await api.getContract(contractId);
        setContract(data || null);
    };
    fetchContract();
  }, [contractId]);

  if (!contract) return <div className="p-10 text-center">Loading Workspace...</div>;

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
       <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-indigo-600 group">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">S</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Skillora Workroom</span>
          </Link>
          <div className="flex gap-4">
             <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1">
                 <i className="fas fa-circle text-[8px]"></i> Active Contract
             </span>
          </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Project Details */}
              <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                      <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{contract.jobTitle}</h1>
                      <div className="flex gap-6 text-sm text-slate-500 mb-6">
                          <span><i className="fas fa-user-circle mr-1"></i> {contract.freelancerName}</span>
                          <span><i className="fas fa-calendar mr-1"></i> Started {contract.startDate}</span>
                      </div>
                      
                      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 mb-6">
                          <h3 className="font-bold text-indigo-900 mb-2">Next Milestone: Initial Draft</h3>
                          <div className="w-full bg-indigo-200 h-2 rounded-full mb-2">
                              <div className="bg-indigo-600 h-2 rounded-full w-1/4"></div>
                          </div>
                          <div className="flex justify-between text-xs text-indigo-700">
                              <span>In Progress</span>
                              <span>Due in 3 days</span>
                          </div>
                      </div>

                      <div className="border-t border-slate-100 pt-6">
                          <h3 className="font-bold text-slate-900 mb-4">Project Files & Assets</h3>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="border border-slate-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50">
                                  <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center text-xl"><i className="fas fa-file-pdf"></i></div>
                                  <div>
                                      <div className="text-sm font-bold text-slate-800">Project_Brief.pdf</div>
                                      <div className="text-xs text-slate-400">2.4 MB</div>
                                  </div>
                              </div>
                              <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-center text-slate-400 border-dashed cursor-pointer hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-300">
                                  <div className="text-center">
                                      <i className="fas fa-cloud-upload-alt text-xl mb-1"></i>
                                      <div className="text-xs font-bold">Upload File</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Message Board */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-80 flex flex-col">
                      <div className="flex-1 overflow-y-auto mb-4">
                          <div className="text-center text-xs text-slate-400 my-4">-- Contract Started --</div>
                          <div className="flex gap-3 mb-4">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">S</div>
                              <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none text-sm text-slate-600">
                                  Welcome to the workroom! Feel free to upload files and discuss the project here.
                              </div>
                          </div>
                      </div>
                      <div className="relative">
                          <input type="text" placeholder="Type a message..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-300" />
                          <button className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"><i className="fas fa-paper-plane text-xs"></i></button>
                      </div>
                  </div>
              </div>

              {/* Right: Payment Info */}
              <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Payment Status</h3>
                      <div className="text-3xl font-extrabold text-slate-900 mb-1">{contract.amount}</div>
                      <div className="text-xs text-slate-500 mb-6">Total Budget (Escrow Funded)</div>
                      
                      <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl mb-3 hover:bg-slate-800 transition-colors">Release Payment</button>
                      <button className="w-full border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors">Request Refund</button>
                  </div>
              </div>
          </div>
      </main>
    </div>
  );
};

export default ContractView;