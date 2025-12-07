
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { polishText, generateJobDescription } from '../services/geminiService';
import { api } from '../services/mockBackend';
import { Job, User } from '../types';

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  
  // Header State
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = api.getCurrentUser();
    if (!user) {
        navigate('/signup');
        return;
    }
    setCurrentUser(user);
    loadJobs();

    const handleClickOutside = (event: MouseEvent) => {
        if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
            setShowProfileMenu(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navigate]);

  const loadJobs = async () => {
      const jobs = await api.getMyJobs();
      setActiveJobs(jobs);
  };

  const handlePolish = async () => {
    if (jobDescription) {
        setIsPolishing(true);
        const polished = await polishText(jobDescription, 'professional');
        setJobDescription(polished);
        setIsPolishing(false);
    } else if (jobTitle) {
        setIsPolishing(true);
        const generated = await generateJobDescription(jobTitle);
        setJobDescription(generated);
        setIsPolishing(false);
    }
  };

  const handlePostJob = async () => {
    if(!jobTitle) return;
    setIsPosting(true);
    await api.postJob({ title: jobTitle, description: jobDescription });
    setIsPosting(false);
    setJobTitle('');
    setJobDescription('');
    await loadJobs(); // Refresh list
    alert('Job Posted Successfully to Database!');
  };

  const handleLogout = () => {
      api.logout();
      navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-10">
      <header className="glass-effect sticky top-0 z-50 px-6 py-3 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/client-dashboard" className="flex items-center gap-3 text-indigo-600 group cursor-pointer">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200 transition-transform group-hover:scale-105">S</div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Skillora</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
              <a href="#" className="px-4 py-1.5 rounded-lg bg-white text-indigo-600 font-semibold text-sm shadow-sm transition-all">Dashboard</a>
              <Link to="/find-projects" className="px-4 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors hover:bg-slate-200/50">Browse Talent</Link>
              <Link to="/messages" className="px-4 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors hover:bg-slate-200/50">Messages</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
             <div 
                ref={profileRef}
                className="relative flex items-center gap-3 cursor-pointer hover:bg-white p-1 pr-3 rounded-full border border-transparent hover:border-slate-200 transition-all"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
             >
                <img src={currentUser?.avatar || "https://i.pravatar.cc/150?u=client_boss"} alt="Client Profile" className="w-8 h-8 rounded-full border border-slate-200" />
                <div className="hidden md:block text-left">
                    <div className="text-xs font-bold text-slate-800">{currentUser?.name || "Client"}</div>
                    <div className="text-[10px] font-medium text-slate-400">Client Account</div>
                </div>
                <i className="fas fa-chevron-down text-xs text-slate-300 ml-1"></i>
                
                {showProfileMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 cursor-default">
                        <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"><i className="fas fa-user-circle"></i> Profile</button>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><i className="fas fa-sign-out-alt"></i> Logout</button>
                    </div>
                )}
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-2 hidden lg:block">
          <div className="sticky top-24 space-y-8">
             <div>
                <h3 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Management</h3>
                <ul className="space-y-1">
                    <li><a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-sm"><i className="fas fa-home w-5"></i> Overview</a></li>
                    <li><button onClick={() => window.scrollTo({ top: 500, behavior: 'smooth'})} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-white font-medium text-sm w-full text-left"><i className="fas fa-briefcase w-5"></i> Active Jobs</button></li>
                </ul>
             </div>
             <div className="bg-indigo-600 rounded-2xl p-5 text-center text-white shadow-lg shadow-indigo-200">
                <h4 className="font-bold text-sm mb-1">Need new talent?</h4>
                <p className="text-xs text-indigo-100 mb-3">Post a job to reach thousands of pros.</p>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full bg-white text-indigo-600 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">Post Job</button>
             </div>
          </div>
        </div>

        <div className="lg:col-span-10 xl:col-span-7 space-y-8">
          <div>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Good morning, {currentUser?.name?.split(' ')[0]} 👋</h1>
                    <p className="text-slate-500 text-sm">Here's what's happening with your job postings today.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl"><i className="fas fa-briefcase"></i></div>
                    <div><div className="text-2xl font-bold text-slate-900">{activeJobs.length}</div><div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Active Jobs</div></div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl"><i className="fas fa-file-alt"></i></div>
                    <div><div className="text-2xl font-bold text-slate-900">12</div><div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">New Proposals</div></div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl"><i className="fas fa-comment-dots"></i></div>
                    <div><div className="text-2xl font-bold text-slate-900">5</div><div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Unread Messages</div></div>
                </div>
            </div>
          </div>

          {/* AI Job Post Draft */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-[2rem] p-6 text-white shadow-lg shadow-slate-200 relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"><i className="fas fa-magic text-indigo-300"></i></div>
                    <h2 className="font-bold text-lg">Draft a Job Post with AI</h2>
                </div>
                
                <div className="mb-3 space-y-2">
                    <input 
                        type="text" 
                        className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 text-white placeholder-indigo-200/50 focus:outline-none text-sm font-bold"
                        placeholder="Job Title (e.g. Senior React Developer)"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                    />
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/10">
                        <textarea 
                            rows={3} 
                            className="w-full bg-transparent border-none text-white placeholder-indigo-200/50 p-3 focus:outline-none resize-none text-sm leading-relaxed"
                            placeholder="Description..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <button 
                      onClick={handlePolish}
                      disabled={isPolishing}
                      className="flex items-center gap-2 text-xs font-bold text-indigo-200 hover:text-white transition-colors"
                    >
                        <i className={`fas ${isPolishing ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i> 
                        <span>{jobDescription ? 'Optimize Description' : 'Generate Description'}</span>
                    </button>
                    <button 
                        onClick={handlePostJob}
                        disabled={isPosting}
                        className="bg-white text-indigo-900 hover:bg-indigo-50 px-5 py-2 rounded-lg text-sm font-bold shadow-lg transition-all"
                    >
                        {isPosting ? 'Posting...' : 'Post Job Now'}
                    </button>
                </div>
             </div>
          </div>

          {/* Active Jobs List */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                 <h3 className="font-bold text-slate-900 text-lg">Your Active Jobs</h3>
                 <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</a>
             </div>
             
             {activeJobs.length === 0 ? (
                 <div className="p-8 text-center text-slate-400 text-sm">
                     You haven't posted any jobs yet. Use the tool above to create one!
                 </div>
             ) : (
                 activeJobs.map(job => (
                    <div key={job.id} className="p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 onClick={() => navigate(`/job/${job.id}/proposals`)} className="font-bold text-slate-800 text-base mb-1 hover:text-indigo-600 cursor-pointer">{job.title}</h4>
                                <p className="text-xs text-slate-400">Posted {job.postedTime} • Public</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {job.status === 'closed' ? (
                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full border border-slate-200">Closed</span>
                                ) : (
                                    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100">Active</span>
                                )}
                                <button className="text-slate-300 hover:text-slate-600"><i className="fas fa-ellipsis-h"></i></button>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 mt-4">
                            <div className="text-center px-2">
                                <div className="text-lg font-bold text-slate-900">{job.proposalsCount}</div>
                                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Proposals</div>
                            </div>
                            <div className="ml-auto">
                                <button onClick={() => navigate(`/job/${job.id}/proposals`)} className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all bg-white shadow-sm">Review Proposals</button>
                            </div>
                        </div>
                    </div>
                 ))
             )}
          </div>

          <div className="flex items-center justify-between pt-4">
             <h3 className="font-bold text-slate-900 text-lg">Top Rated Talent for You</h3>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-300 group">
              <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex-shrink-0">
                      <div className="relative inline-block">
                        <img src="https://i.pravatar.cc/150?u=ella_pro" alt="Ella" className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm"/>
                        <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">98% Job Success</div>
                      </div>
                  </div>
                  <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                          <div>
                              <h4 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">Arjeet Kumar</h4>
                              <p className="text-sm font-semibold text-slate-500">Senior Product Designer (UX/UI)</p>
                          </div>
                          <div className="text-right">
                              <div className="font-bold text-slate-900">Rs 1200<span className="text-slate-400 text-xs font-medium">/hr</span></div>
                          </div>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                          Specialized in building complex SaaS dashboards and mobile applications. 7+ years of experience working with fintech startups.
                      </p>
                  </div>
              </div>
              <div className="flex gap-3 mt-5">
                  <button onClick={() => navigate('/messages', { state: { contactId: 'c1' } })} className="flex-1 block text-center bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md shadow-slate-200">Message</button>
                  <button onClick={() => navigate('/checkout', { state: { freelancerName: 'Arjeet Kumar', amount: 'Rs 1500' } })} className="flex-1 block text-center border-2 border-indigo-600 text-indigo-600 font-bold py-2.5 rounded-xl hover:bg-indigo-50 transition-colors">Hire</button>
              </div>
          </div>
        </div>

        <div className="xl:col-span-3 hidden xl:block">
            <div className="sticky top-24 space-y-6">
                <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
                    <div className="flex items-start gap-3">
                        <i className="fas fa-life-ring text-indigo-500 mt-1"></i>
                        <div>
                            <h3 className="font-bold text-indigo-900 text-sm mb-1">Need help hiring?</h3>
                            <p className="text-xs text-indigo-700/80 mb-3 leading-relaxed">Our talent specialists can help you find the perfect match.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
