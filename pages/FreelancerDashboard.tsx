
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { polishText } from '../services/geminiService';
import { api } from '../services/mockBackend';
import { Notification, User } from '../types';

const FreelancerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [postText, setPostText] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    if (currentUser) setUser(currentUser);

    const fetchNotifications = async () => {
        const notifs = await api.getNotifications();
        setNotifications(notifs);
    };
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
        if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
            setShowProfileMenu(false);
            setShowNotifications(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePolish = async () => {
    if (!postText) return;
    setIsPolishing(true);
    const polished = await polishText(postText, 'engaging');
    setPostText(polished);
    setIsPolishing(false);
  };

  const handleLogout = () => {
      api.logout();
      navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-blue-100/50 shadow-sm">
        <div className="flex items-center gap-10">
          <Link to="/dashboard" className="flex items-center gap-2.5 text-blue-600 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 transition-transform group-hover:scale-105">S</div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Skillora</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-semibold">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 transition-colors">Home</Link>
            <Link to="/find-projects" className="text-blue-950 hover:text-blue-600 transition-colors">Find Work</Link>
            <Link to="/my-proposals" className="text-blue-950 hover:text-blue-600 transition-colors">My Proposals</Link>
            <Link to="/messages" className="text-blue-950 hover:text-blue-600 transition-colors">Messages</Link>
          </nav>
        </div>
        <div className="flex items-center gap-5" ref={profileRef}>
          <button className="text-slate-400 hover:text-blue-600 transition-colors"><i className="far fa-envelope text-xl"></i></button>
          
          <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                className="text-slate-400 hover:text-blue-600 transition-colors relative"
            >
                <i className="far fa-bell text-xl"></i>
                {notifications.some(n => !n.isRead) && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>}
            </button>
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50">
                    <h4 className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Notifications</h4>
                    {notifications.length === 0 ? (
                        <div className="px-3 py-4 text-center text-sm text-slate-500">No new notifications</div>
                    ) : (
                        <div className="max-h-60 overflow-y-auto">
                            {notifications.map(n => (
                                <div key={n.id} className="px-3 py-2 hover:bg-slate-50 rounded-lg mb-1">
                                    <p className="text-xs font-medium text-slate-800">{n.text}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
          </div>

          <div className="w-px h-8 bg-gray-200 mx-1"></div>
          
          <div className="relative">
            <img 
                src={user?.avatar || "https://i.pravatar.cc/150?u=user"}
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-md cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
            />
            {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                    <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"><i className="fas fa-user-circle"></i> Profile</button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><i className="fas fa-sign-out-alt"></i> Logout</button>
                </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 xl:col-span-2 hidden lg:block">
          <div className="sticky top-28 flex flex-col gap-6 w-full">
            <div className="bg-white rounded-3xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100">
              <div className="group flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 bg-blue-50 text-blue-700 font-semibold shadow-sm ring-1 ring-blue-100">
                <i className="fas fa-home w-5 text-center text-lg text-blue-600 transition-colors"></i>
                <span className="text-sm tracking-wide">Dashboard</span>
              </div>
              <Link to="/find-projects" className="group flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 text-slate-500 hover:bg-slate-50 hover:text-slate-900">
                <i className="fas fa-fire w-5 text-center text-lg text-slate-400 group-hover:text-blue-500 transition-colors"></i>
                <span className="text-sm tracking-wide">Talent Feed</span>
              </Link>
              <Link to="/my-proposals" className="group flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 text-slate-500 hover:bg-slate-50 hover:text-slate-900">
                <i className="fas fa-th-large w-5 text-center text-lg text-slate-400 group-hover:text-blue-500 transition-colors"></i>
                <span className="text-sm tracking-wide">My Proposals</span>
              </Link>
              <Link to="/messages" className="group flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 text-slate-500 hover:bg-slate-50 hover:text-slate-900">
                <i className="far fa-clock w-5 text-center text-lg text-slate-400 group-hover:text-blue-500 transition-colors"></i>
                <span className="text-sm tracking-wide">Messages</span>
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
               <div className="flex items-center gap-3 mb-6 relative z-10">
                 <div className="w-11 h-11 bg-blue-100/50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                   <i className="fas fa-bezier-curve text-lg"></i>
                 </div>
                 <div>
                   <div className="text-sm font-bold text-slate-900">Rewards</div>
                   <div className="text-xs text-slate-500 font-medium">Senior Designer</div>
                 </div>
               </div>
               <div className="mb-6">
                 <div className="text-3xl font-bold text-slate-900">200 <span className="text-sm font-medium text-slate-400 align-middle ml-1">Likes</span></div>
               </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 xl:col-span-7">
          <div className="bg-white rounded-[2rem] p-8 md:p-10 mb-8 shadow-[0_4px_30px_rgba(37,99,235,0.08)] border border-blue-50/50 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-50/50 to-transparent pointer-events-none"></div>
            <div className="z-10 md:w-1/2 relative">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-4 tracking-wider uppercase">Skill Access</div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-[1.15]">
                Grow Your Skills <br/> <span className="text-blue-600"> & Earn Money</span>
              </h1>
              <div className="flex gap-4">
                <Link to="/find-projects" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform hover:translate-y-[-2px]">
                  Find Projects
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-end mt-10 md:mt-0 relative z-10">
               {/* Illustration Placeholder */}
               <div className="w-64 h-48 bg-blue-100 rounded-2xl opacity-50"></div>
            </div>
          </div>

          {/* Create Post Widget */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 mb-8">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Create Post</h3>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden ring-4 ring-white shadow-md">
                <img src={user?.avatar || "https://i.pravatar.cc/150?u=user"} alt="Me" className="w-full h-full object-cover"/>
              </div>
              <div className="flex-1">
                <textarea 
                  className="w-full bg-slate-50 rounded-2xl p-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-100/50 focus:bg-white resize-none transition-all placeholder:text-slate-400"
                  placeholder="Share your latest work or thoughts..."
                  rows={3}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                ></textarea>
                <div className="flex justify-between items-center mt-3 pl-1">
                  <div className="flex gap-3 text-slate-400">
                    <button className="hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg"><i className="fas fa-image text-lg"></i></button>
                    <button className="hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg"><i className="fas fa-video text-lg"></i></button>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={handlePolish}
                      disabled={isPolishing}
                      className="text-xs px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 text-indigo-600 hover:shadow-md"
                    >
                      <i className={`fas ${isPolishing ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
                      <span>AI Polish</span>
                    </button>
                    <button className="bg-blue-600 text-white text-sm px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="space-y-6">
             <div className="bg-white rounded-3xl p-6 shadow border border-slate-100 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src="https://i.pravatar.cc/150?u=ella" className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm" alt="User"/>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Khushi kumari</h4>
                      <p className="text-xs font-medium text-slate-500">Science Student</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full text-xs font-bold transition-colors">Follow</button>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Portrait Drawing</h3>
                <p className="text-slate-600 text-[15px] mb-4">My latest portfolio created with graphite pencils. Let me know your thoughts!</p>
                <div className="w-full h-72 rounded-2xl overflow-hidden mb-5 bg-slate-100">
                   <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2459&auto=format&fit=crop" className="w-full h-full object-cover" alt="Art"/>
                </div>
             </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block xl:col-span-3">
          <div className="sticky top-28 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 shadow-lg text-white">
              <h3 className="font-bold text-lg mb-2">Looking for work?</h3>
              <p className="text-blue-100 text-sm mb-6">Browse 500+ new opportunities today.</p>
              <Link to="/find-projects" className="block text-center w-full bg-white text-blue-600 font-bold py-3 rounded-xl transition-all shadow-md hover:bg-blue-50">
                View Tasks & Apply
              </Link>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow border border-slate-100">
               <h3 className="font-bold text-slate-900 mb-4">Explore Skills</h3>
               <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center gap-3 hover:bg-blue-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-sm"><i className="fas fa-pen-nib"></i></div>
                    <span className="text-xs font-bold text-slate-700">Graphic<br/>Design</span>
                 </div>
                 <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center gap-3 hover:bg-indigo-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-sm"><i className="fas fa-code"></i></div>
                    <span className="text-xs font-bold text-slate-700">Web<br/>Dev</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreelancerDashboard;
