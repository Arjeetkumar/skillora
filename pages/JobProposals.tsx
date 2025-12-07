import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/mockBackend';
import { Job, Proposal } from '../types';

const JobProposals: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;
      const jobData = await api.getJobById(jobId);
      const proposalData = await api.getProposalsForJob(jobId);
      setJob(jobData || null);
      setProposals(proposalData);
      setLoading(false);
    };
    fetchData();
  }, [jobId]);

  if (loading) {
      return <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center"><i className="fas fa-spinner fa-spin text-3xl text-indigo-600"></i></div>;
  }

  if (!job) {
      return <div className="p-10 text-center">Job not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20">
      <header className="glass-effect sticky top-0 z-50 px-6 py-4 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link to="/client-dashboard" className="flex items-center gap-3 text-indigo-600 group">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">S</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Skillora</span>
          </Link>
          <div className="flex items-center gap-3">
             <Link to="/client-dashboard" className="text-slate-500 hover:text-slate-900 font-medium text-sm">Dashboard</Link>
             <div className="w-px h-4 bg-slate-300"></div>
             <span className="text-slate-900 font-bold text-sm">Proposals</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="mb-8">
            <Link to="/client-dashboard" className="text-indigo-600 text-xs font-bold mb-2 inline-block hover:underline"><i className="fas fa-arrow-left mr-1"></i> Back to Dashboard</Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
                <span><i className="far fa-clock mr-1"></i> Posted {job.postedTime}</span>
                <span><i className="fas fa-tag mr-1"></i> {job.budget}</span>
                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">{proposals.length} Applicants</span>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
            {proposals.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 text-2xl">
                        <i className="far fa-folder-open"></i>
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg">No proposals yet</h3>
                    <p className="text-slate-500">Wait for freelancers to find your amazing job post.</p>
                </div>
            ) : (
                proposals.map(proposal => (
                    <div key={proposal.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <img src={proposal.freelancerAvatar} alt={proposal.freelancerName} className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-sm" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{proposal.freelancerName}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            {proposal.matchScore && (
                                                <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">
                                                    {proposal.matchScore}% Match
                                                </span>
                                            )}
                                            <span className="text-xs text-slate-400">Applied {new Date(proposal.submittedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => navigate('/messages', { state: { contactId: 'c1' } })} // Mock contact ID for demo
                                            className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                            title="Message"
                                        >
                                            <i className="far fa-comment-dots"></i>
                                        </button>
                                        <button 
                                            onClick={() => navigate('/checkout', { state: { freelancerName: proposal.freelancerName, amount: job.budget, jobId: job.id } })}
                                            className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-indigo-600 transition-colors shadow-md"
                                        >
                                            Hire
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 mt-3">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Cover Letter</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {proposal.coverLetter}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </main>
    </div>
  );
};

export default JobProposals;