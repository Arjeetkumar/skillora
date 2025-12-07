import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/mockBackend';
import { Job, Proposal, Contract } from '../types';

interface Application {
    job: Job;
    proposal: Proposal;
    contract?: Contract;
}

const MyProposals: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getMyProposals();
      setApplications(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-blue-100/50 shadow-sm">
        <div className="flex items-center gap-10">
          <Link to="/dashboard" className="flex items-center gap-2.5 text-blue-600 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 transition-transform group-hover:scale-105">S</div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Skillora</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-semibold">
            <Link to="/dashboard" className="text-blue-950 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/find-projects" className="text-blue-950 hover:text-blue-600 transition-colors">Find Work</Link>
            <Link to="/my-proposals" className="text-blue-600 hover:text-blue-700 transition-colors">My Proposals</Link>
          </nav>
        </div>
        <div className="flex items-center gap-5">
            <img src="https://i.pravatar.cc/150?u=user" alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">My Applications</h1>

        {loading ? (
            <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-3xl text-indigo-600"></i></div>
        ) : applications.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-300 text-3xl">
                    <i className="far fa-paper-plane"></i>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">No active applications</h2>
                <p className="text-slate-500 mb-6">Start browsing projects and submit your first proposal!</p>
                <Link to="/find-projects" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors">Find Projects</Link>
            </div>
        ) : (
            <div className="space-y-4">
                {applications.map(({ job, proposal, contract }) => (
                    <div key={proposal.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                    proposal.status === 'accepted' 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                    {proposal.status === 'accepted' ? 'Hired' : 'Submitted'}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                                <span><i className="fas fa-tag mr-1 text-slate-400"></i> {job.budget}</span>
                                <span><i className="far fa-calendar mr-1 text-slate-400"></i> Applied: {new Date(proposal.submittedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600 italic border border-slate-100">
                                "{proposal.coverLetter.substring(0, 120)}..."
                            </div>
                        </div>
                        <div className="flex flex-col justify-center gap-2 min-w-[140px]">
                            <button onClick={() => navigate(`/job/${job.id}`)} className="w-full border border-slate-200 text-slate-600 font-bold py-2 rounded-lg hover:bg-slate-50 text-sm">View Job</button>
                            {contract && (
                                <button onClick={() => navigate(`/contract/${contract.id}`)} className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 text-sm shadow-md">Workroom</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
};

export default MyProposals;