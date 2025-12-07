
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/mockBackend';
import { Job } from '../types';

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;
      const jobData = await api.getJobById(jobId);
      setJob(jobData || null);
      setLoading(false);
    };
    fetchData();
  }, [jobId]);

  if (loading) return <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center"><i className="fas fa-spinner fa-spin text-3xl text-indigo-600"></i></div>;
  if (!job) return <div className="p-10 text-center">Job not found</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 text-indigo-600 group">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">S</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Skillora</span>
          </Link>
          <div className="flex gap-4">
             <button onClick={() => navigate(-1)} className="text-slate-500 font-bold hover:text-indigo-600 text-sm">Back</button>
          </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{job.title}</h1>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">{job.level}</span>
                        <span>•</span>
                        <span>Posted {job.postedTime}</span>
                        <span>•</span>
                        <span className="text-green-600 font-medium"><i className="fas fa-check-circle"></i> Payment Verified</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-400 font-medium">Budget</div>
                    <div className="text-xl font-bold text-slate-900">{job.budget}</div>
                </div>
            </div>

            <div className="border-t border-slate-100 pt-6 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 text-lg">Job Description</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
                {job.tags.map(tag => (
                    <span key={tag} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">{tag}</span>
                ))}
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <div className="text-sm font-bold text-slate-900 mb-1">About the Client</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex text-yellow-500"><i className="fas fa-star"></i> {job.clientRating}</span>
                        <span>•</span>
                        <span>{job.reviewCount} Reviews</span>
                        <span>•</span>
                        <span>India</span>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/find-projects', { state: { selectedJobId: job.id } })}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all"
                >
                    Apply Now
                </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;
