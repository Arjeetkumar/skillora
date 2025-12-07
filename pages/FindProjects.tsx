
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/mockBackend';
import { draftProposal, analyzeJobMatch } from '../services/geminiService';
import { Job, Notification } from '../types';

const FindProjects: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Proposal State
  const [proposalJobTitle, setProposalJobTitle] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [generatedProposal, setGeneratedProposal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [matchScore, setMatchScore] = useState<{score: number, reason: string} | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  // Profile Dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const aiToolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
        setLoading(true);
        await fetchNotifications();
        await fetchJobs();
        
        // Handle incoming navigation state (e.g. from Job Details Apply button)
        const incomingJobId = location.state?.selectedJobId;
        if (incomingJobId) {
            const allJobs = await api.getJobs();
            const targetJob = allJobs.find(j => j.id === incomingJobId);
            if (targetJob) {
                // Ensure we have the job data before selecting
                handleSelectJob(targetJob);
            }
        }
    };
    init();

    const handleClickOutside = (event: MouseEvent) => {
        if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
            setShowProfileMenu(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Run once on mount

  const fetchJobs = async (query = '') => {
      setLoading(true);
      const data = await api.getJobs(query);
      setJobs(data);
      
      const myProposals = await api.getMyProposals();
      const appliedSet = new Set(myProposals.map(p => p.job.id));
      setAppliedJobs(appliedSet);

      setLoading(false);
  };

  const fetchNotifications = async () => {
      const notifs = await api.getNotifications();
      setNotifications(notifs);
  };

  const handleSearch = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          fetchJobs(searchQuery);
      }
  };

  const handleSelectJob = async (job: Job) => {
      setProposalJobTitle(job.title);
      setSelectedJobId(job.id);
      setGeneratedProposal(''); 
      setMatchScore(null);
      
      // Scroll to AI tool
      setTimeout(() => {
        if (aiToolRef.current) {
            aiToolRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      // Simulating analysis based on dummy skills
      const match = await analyzeJobMatch(job.description, "React, TypeScript, Frontend Development");
      setMatchScore(match);
  };

  const handleGenerateProposal = async () => {
    if (!proposalJobTitle) return;
    setIsGenerating(true);
    const proposal = await draftProposal(proposalJobTitle);
    setGeneratedProposal(proposal);
    setIsGenerating(false);
  };

  const handleApply = async () => {
      if (!selectedJobId || !generatedProposal) return;
      const success = await api.submitProposal(selectedJobId, generatedProposal, matchScore?.score);
      
      if (success) {
        setAppliedJobs(prev => new Set(prev).add(selectedJobId));
        setGeneratedProposal('');
        setSelectedJobId(null);
        setProposalJobTitle('');
        await fetchNotifications();
        alert("Application saved to database! Check 'My Proposals'.");
      } else {
        alert("You have already applied to this job.");
      }
  };

  const handleLogout = () => {
      api.logout();
      navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
       <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 shrink-0 sticky top-0">
        <div className="flex items-center gap-12">
            <Link to="/dashboard" className="flex items-center gap-3 text-indigo-600 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">S</div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">Skillora</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
                <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
                <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full">Find Work</span>
                <Link to="/my-proposals" className="hover:text-indigo-600 transition-colors">My Proposals</Link>
                <Link to="/messages" className="hover:text-indigo-600 transition-colors">Messages</Link>
            </nav>
        </div>
        <div className="flex items-center gap-4">
             {/* Notification Bell */}
             <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <i className="far fa-bell text-xl"></i>
                    {notifications.some(n => !n.isRead) && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
                </button>
                {showNotifications && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50">
                        <h4 className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Notifications</h4>
                        {notifications.length === 0 ? (
                            <div className="px-3 py-4 text-center text-sm text-slate-500">No new notifications</div>
                        ) : (
                            <div className="max-h-60 overflow-y-auto">
                                {notifications.map(n => (
                                    <div key={n.id} className="px-3 py-2 hover:bg-slate-50 rounded-lg mb-1 border-b border-slate-50 last:border-0">
                                        <p className="text-xs font-medium text-slate-800">{n.text}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
             </div>

             {/* Profile Dropdown */}
             <div className="relative" ref={profileRef}>
                <img 
                    src="https://i.pravatar.cc/150?u=student_sarah" 
                    alt="User" 
                    className="w-8 h-8 rounded-full border border-slate-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-indigo-100" 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                />
                {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                        <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"><i className="fas fa-user-circle"></i> Profile</button>
                        <button onClick={() => navigate('/my-proposals')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"><i className="fas fa-list"></i> Applications</button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><i className="fas fa-sign-out-alt"></i> Logout</button>
                    </div>
                )}
             </div>
        </div>
    </header>

    <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Find Projects</h1>
                    <p className="text-sm text-slate-500 mb-6">Browse high-quality projects tailored to your skills</p>
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input 
                                type="text" 
                                placeholder="Search for projects (e.g. React, Design) & Hit Enter" 
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 shadow-sm text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-3xl text-indigo-600"></i></div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">No jobs found matching "{searchQuery}"</div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <div key={job.id} className={`bg-white border rounded-2xl p-6 transition-all group ${selectedJobId === job.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 hover:border-indigo-300'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 
                                        onClick={() => navigate(`/job/${job.id}`)}
                                        className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer hover:underline"
                                    >
                                        {job.title}
                                        {job.isNew && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase font-bold no-underline inline-block">New</span>}
                                        {job.status === 'closed' && <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase font-bold no-underline inline-block">Closed</span>}
                                    </h3>
                                    {!appliedJobs.has(job.id) && job.status !== 'closed' && (
                                        <button onClick={() => handleSelectJob(job)} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100">Draft Proposal</button>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                                    <span className="font-medium text-slate-700">{job.type} - {job.level}</span>
                                    <span>•</span>
                                    <span>{job.postedTime}</span>
                                    {job.verified && <span className="flex items-center gap-1 text-green-600 font-medium"><i className="fas fa-check-circle text-[10px]"></i> Verified</span>}
                                </div>
                                <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-2">{job.description}</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {job.tags.map(tag => (
                                        <span key={tag} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="text-right">
                                        <div className="text-xs text-slate-400">Budget</div>
                                        <div className="text-sm font-bold text-slate-900">{job.budget}</div>
                                    </div>
                                    {appliedJobs.has(job.id) ? (
                                        <span className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1.5 rounded-lg border border-green-100"><i className="fas fa-check mr-1"></i> Applied</span>
                                    ) : job.status === 'closed' ? (
                                         <button disabled className="bg-slate-100 text-slate-400 px-5 py-2 rounded-lg text-sm font-bold cursor-not-allowed">Hiring Closed</button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button onClick={() => navigate(`/job/${job.id}`)} className="text-slate-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">View Details</button>
                                            <button onClick={() => handleSelectJob(job)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">Apply Now</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-full lg:w-80 space-y-6" ref={aiToolRef}>
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden sticky top-24">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <i className="fas fa-magic text-yellow-300"></i>
                            <h3 className="font-bold text-lg">Cover Letter AI</h3>
                        </div>

                        {matchScore && selectedJobId && (
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4 border border-white/20">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-indigo-100">AI Match Score</span>
                                    <span className="text-sm font-bold text-white">{matchScore.score}%</span>
                                </div>
                                <div className="w-full bg-black/20 h-1.5 rounded-full mb-2">
                                    <div className="bg-green-400 h-1.5 rounded-full" style={{ width: `${matchScore.score}%` }}></div>
                                </div>
                                <p className="text-[10px] text-indigo-200 leading-tight">{matchScore.reason}</p>
                            </div>
                        )}
                        
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] font-bold text-indigo-200 uppercase tracking-wide block mb-1">Job Title</label>
                                <input 
                                    type="text" 
                                    value={proposalJobTitle}
                                    onChange={(e) => setProposalJobTitle(e.target.value)}
                                    placeholder="Select a job to start" 
                                    className="w-full bg-indigo-800/50 border border-indigo-500 rounded-lg px-3 py-2 text-sm text-white placeholder-indigo-300 focus:outline-none"
                                />
                            </div>
                            <button 
                                onClick={handleGenerateProposal}
                                disabled={isGenerating || !selectedJobId}
                                className={`w-full bg-white text-indigo-700 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm flex items-center justify-center gap-2 ${!selectedJobId && 'opacity-50 cursor-not-allowed'}`}
                            >
                                <span>{isGenerating ? 'Drafting...' : 'Draft Proposal'}</span>
                                <i className="fas fa-pen-fancy"></i>
                            </button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-indigo-500/30">
                             <textarea 
                                value={generatedProposal}
                                onChange={(e) => setGeneratedProposal(e.target.value)}
                                rows={6} 
                                className="w-full bg-indigo-900/40 border border-indigo-500/50 rounded-lg px-3 py-2 text-xs text-indigo-50 placeholder-indigo-400 focus:outline-none resize-none custom-scroll" 
                                placeholder="AI Proposal will appear here..."
                             ></textarea>
                             
                             {generatedProposal && selectedJobId && (
                                <button 
                                    onClick={handleApply}
                                    className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-xs font-bold transition-colors shadow-lg"
                                >
                                    Submit Application
                                </button>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    </div>
  );
};

export default FindProjects;
