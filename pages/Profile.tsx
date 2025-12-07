
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/mockBackend';
import { User } from '../types';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Edit States
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');

  // History Data
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = api.getCurrentUser();
      if (!currentUser) {
          navigate('/signup');
          return;
      }
      setUser(currentUser);
      
      // Init Form State
      setHeadline(currentUser.headline || '');
      setBio(currentUser.bio || '');
      setHourlyRate(currentUser.hourlyRate || '');
      setLocation(currentUser.location || '');
      setSkills(currentUser.skills?.join(', ') || '');

      // Fetch History from "Database"
      if (currentUser.role === 'client') {
          const jobs = await api.getMyJobs();
          setHistory(jobs);
      } else {
          const proposals = await api.getMyProposals();
          setHistory(proposals);
      }
      
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  const handleSave = async () => {
      const updatedSkills = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      
      const updatedUser = await api.updateUser({
          headline,
          bio,
          hourlyRate,
          location,
          skills: updatedSkills
      });
      
      setUser(updatedUser);
      setIsEditing(false);
      alert("Profile updated successfully in database!");
  };

  const handleImageUpload = async () => {
      // Simulate image upload by picking a random new avatar
      const newAvatarId = Math.random().toString(36).substring(7);
      const newAvatarUrl = `https://i.pravatar.cc/150?u=${newAvatarId}`;
      const updatedUser = await api.updateUser({ avatar: newAvatarUrl });
      setUser(updatedUser);
  };

  const handleResetDatabase = () => {
      if(confirm("Are you sure? This will delete all jobs, proposals, and messages and reset the app.")) {
          api.resetDatabase();
      }
  }

  if (loading || !user) {
      return <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center"><i className="fas fa-spinner fa-spin text-3xl text-indigo-600"></i></div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
       {/* Header */}
       <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-blue-100/50 shadow-sm">
        <div className="flex items-center gap-10">
          <Link to={user.role === 'client' ? "/client-dashboard" : "/dashboard"} className="flex items-center gap-2.5 text-blue-600 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 transition-transform group-hover:scale-105">S</div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Skillora</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-semibold">
             <Link to={user.role === 'client' ? "/client-dashboard" : "/dashboard"} className="text-blue-950 hover:text-blue-600 transition-colors">Dashboard</Link>
             <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full">Profile</span>
          </nav>
        </div>
        <button onClick={handleResetDatabase} className="text-xs text-red-500 hover:text-red-700 font-bold border border-red-200 px-3 py-1 rounded hover:bg-red-50">Reset Database</button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Left Column: Stats & Contact */}
             <div className="space-y-6">
                 <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                     <div className="relative z-10 -mt-12 mb-4 group cursor-pointer" onClick={handleImageUpload} title="Click to change photo">
                         <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto object-cover bg-white"/>
                         <div className="absolute inset-0 bg-black/30 rounded-full w-24 h-24 mx-auto opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">Change</div>
                     </div>
                     <h1 className="text-xl font-bold text-slate-900 mb-1">{user.name}</h1>
                     <p className="text-slate-500 text-sm mb-4">{user.role === 'client' ? 'Client Account' : 'Freelancer'}</p>
                     
                     <div className="flex justify-center gap-2 mb-6">
                         <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full"><i className="fas fa-map-marker-alt mr-1"></i> {location || 'Remote'}</span>
                         {user.role === 'freelancer' && <span className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1 rounded-full"><i className="fas fa-bolt mr-1"></i> Available</span>}
                     </div>

                     {!isEditing ? (
                         <button onClick={() => setIsEditing(true)} className="w-full border border-slate-200 text-slate-600 font-bold py-2 rounded-xl hover:bg-slate-50 transition-colors text-sm">Edit Profile</button>
                     ) : (
                         <div className="flex gap-2">
                             <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-xl hover:bg-indigo-700 text-sm">Save</button>
                             <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-2 rounded-xl hover:bg-slate-200 text-sm">Cancel</button>
                         </div>
                     )}
                 </div>

                 {isEditing && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <label className="text-xs font-bold text-slate-400 uppercase">Location</label>
                        <input 
                            type="text" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none text-sm"
                            placeholder="e.g. New York, USA"
                        />
                    </div>
                 )}

                 <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                     <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Stats</h3>
                     <div className="space-y-4">
                         <div className="flex justify-between items-center">
                             <span className="text-sm text-slate-500">Total Earnings</span>
                             <span className="font-bold text-slate-900">$12k+</span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="text-sm text-slate-500">Jobs Completed</span>
                             <span className="font-bold text-slate-900">14</span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="text-sm text-slate-500">Hours Worked</span>
                             <span className="font-bold text-slate-900">340</span>
                         </div>
                     </div>
                 </div>
             </div>

             {/* Right Column: Info */}
             <div className="lg:col-span-2 space-y-6">
                 
                 {/* Main Info Card */}
                 <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                     <div className="flex justify-between items-start mb-4">
                        <div className="w-full">
                            {!isEditing ? (
                                <h2 className="text-2xl font-bold text-slate-900">{headline || 'Professional'}</h2>
                            ) : (
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Headline</label>
                                    <input 
                                        type="text" 
                                        value={headline} 
                                        onChange={(e) => setHeadline(e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none font-bold text-lg"
                                        placeholder="e.g. Senior Full Stack Developer"
                                    />
                                </div>
                            )}
                            
                            {user.role === 'freelancer' && (
                                <div className="text-lg font-bold text-indigo-600 mt-1 mb-4">
                                    {!isEditing ? (hourlyRate || '$0.00/hr') : (
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase block">Hourly Rate</label>
                                            <input 
                                                type="text" 
                                                value={hourlyRate} 
                                                onChange={(e) => setHourlyRate(e.target.value)}
                                                className="border border-slate-300 rounded-lg p-2 w-32 text-sm mt-1"
                                                placeholder="Rs 1000/hr"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                     </div>

                     <div className="mb-6">
                         <h3 className="font-bold text-slate-900 mb-2 text-sm">About</h3>
                         {!isEditing ? (
                             <p className="text-slate-600 leading-relaxed whitespace-pre-line">{bio || 'No bio yet. Click edit to add one!'}</p>
                         ) : (
                            <textarea 
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={6}
                                className="w-full border border-slate-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none text-sm"
                                placeholder="Tell clients about your experience and skills..."
                            ></textarea>
                         )}
                     </div>

                     {user.role === 'freelancer' && (
                         <div>
                            <h3 className="font-bold text-slate-900 mb-3 text-sm">Skills</h3>
                            {!isEditing ? (
                                <div className="flex flex-wrap gap-2">
                                    {skills && skills.length > 0 ? skills.split(',').map((skill, i) => (
                                        <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{skill.trim()}</span>
                                    )) : <span className="text-slate-400 text-sm italic">No skills listed</span>}
                                </div>
                            ) : (
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase">Skills (Comma Separated)</label>
                                    <input 
                                        type="text" 
                                        value={skills}
                                        onChange={(e) => setSkills(e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg p-2 mt-1 text-sm"
                                        placeholder="React, Design, Writing"
                                    />
                                </div>
                            )}
                         </div>
                     )}
                 </div>

                 {/* Activity Feed */}
                 <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                     <h3 className="font-bold text-slate-900 mb-6 text-lg">{user.role === 'client' ? 'Jobs Posted' : 'My Applications'}</h3>
                     
                     <div className="space-y-4">
                         {history.length === 0 ? (
                             <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                 <i className="far fa-folder-open text-2xl mb-2"></i>
                                 <p>No activity records found in database.</p>
                             </div>
                         ) : (
                             history.map((item: any) => {
                                 const title = user.role === 'client' ? item.title : item.job?.title;
                                 const status = user.role === 'client' ? item.status : item.proposal?.status;
                                 const date = user.role === 'client' ? item.postedTime : new Date(item.proposal?.submittedAt).toLocaleDateString();

                                 return (
                                    <div key={item.id || item.proposal.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                            <i className={`fas ${user.role === 'client' ? 'fa-briefcase' : 'fa-paper-plane'}`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
                                            <p className="text-xs text-slate-400 mt-1">{date}</p>
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${status === 'open' || status === 'pending' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-100 text-slate-600 border-slate-200'} capitalize`}>{status}</span>
                                    </div>
                                 );
                             })
                         )}
                     </div>
                 </div>

             </div>
         </div>
      </main>
    </div>
  );
};

export default Profile;
