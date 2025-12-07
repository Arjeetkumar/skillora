import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateHeadline } from '../services/geminiService';
import { api } from '../services/mockBackend';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'client' | 'freelancer'>('freelancer');
  const [roleInput, setRoleInput] = useState('');
  const [headline, setHeadline] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleGenerateHeadline = async () => {
    if (!roleInput) return;
    setIsGenerating(true);
    const result = await generateHeadline(roleInput);
    setHeadline(result);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = firstName && lastName ? `${firstName} ${lastName}` : 'New User';
    
    // Save session
    api.login(role, name);

    if (role === 'freelancer') {
      navigate('/dashboard');
    } else {
      navigate('/client-dashboard');
    }
  };

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden lg:flex relative bg-indigo-900 flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-500 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>

        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-white text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">S</div>
          <span className="text-2xl font-bold tracking-tight">Skillora</span>
        </div>

        <div className="relative z-10 max-w-lg mb-12">
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">Unlock your potential today.</h1>
            <p className="text-indigo-100 text-lg leading-relaxed">Join the world's fastest-growing community of top-tier freelancers and forward-thinking clients.</p>
          </div>
          
          <div className="glass-effect p-6 rounded-2xl">
            <div className="flex text-yellow-400 mb-4 text-sm">
              <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
            </div>
            <p className="text-white text-lg font-medium italic mb-6">"Skillora completely transformed how I find work. Within two weeks, I landed a contract with a Fortune 500 company."</p>
            <div className="flex items-center gap-4">
              <img src="https://i.pravatar.cc/150?u=a" className="w-12 h-12 rounded-full border-2 border-white/50" alt="Avatar"/>
              <div>
                <div className="text-white font-bold">Arjeet Kumar</div>
                <div className="text-indigo-200 text-sm">Full Stack Developer</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex gap-8 text-indigo-200 text-sm font-medium">
          <span>© 2025 Skillora Inc.</span>
          <span className="flex items-center gap-2"><i className="fas fa-check-circle"></i> Trusted by 10k+ companies</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32 bg-white overflow-y-auto custom-scroll">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-10 lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Create an account</h2>
            <p className="text-slate-500">Already have an account? <a href="#" className="text-indigo-600 font-bold hover:underline">Log in</a></p>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">I want to...</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="cursor-pointer group">
                <input 
                  type="radio" 
                  name="role" 
                  value="client" 
                  className="peer hidden" 
                  checked={role === 'client'}
                  onChange={() => setRole('client')}
                />
                <div className={`border rounded-xl p-4 transition-all relative bg-white h-full ${role === 'client' ? 'border-indigo-600 bg-indigo-50 border-2' : 'border-slate-200 hover:border-indigo-300'}`}>
                  <i className={`fas fa-briefcase text-2xl mb-3 transition-colors ${role === 'client' ? 'text-indigo-600' : 'text-slate-400'}`}></i>
                  <div className="font-bold text-slate-900 text-sm mb-1">Hire Talent</div>
                  <div className="text-[10px] text-slate-500 leading-tight">Post jobs and find pros</div>
                  {role === 'client' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">
                      <i className="fas fa-check"></i>
                    </div>
                  )}
                </div>
              </label>
              <label className="cursor-pointer group">
                <input 
                  type="radio" 
                  name="role" 
                  value="freelancer" 
                  className="peer hidden"
                  checked={role === 'freelancer'}
                  onChange={() => setRole('freelancer')}
                />
                <div className={`border rounded-xl p-4 transition-all relative h-full ${role === 'freelancer' ? 'border-indigo-600 bg-indigo-50 border-2' : 'border-slate-200 hover:border-indigo-300'}`}>
                  <i className={`fas fa-laptop-code text-2xl mb-3 transition-colors ${role === 'freelancer' ? 'text-indigo-600' : 'text-slate-400'}`}></i>
                  <div className="font-bold text-slate-900 text-sm mb-1">Find Work</div>
                  <div className="text-[10px] text-slate-500 leading-tight">Offer your services</div>
                  {role === 'freelancer' && (
                     <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">
                      <i className="fas fa-check"></i>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">First Name</label>
                <input 
                  type="text" 
                  placeholder="First Name" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" 
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" 
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Work Email</label>
              <input type="email" placeholder="gmail@example.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" />
              <div className="text-[10px] text-slate-400 mt-1.5 flex gap-3">
                <span className="flex items-center gap-1"><i className="fas fa-check-circle text-green-500"></i> 8+ chars</span>
                <span className="flex items-center gap-1"><i className="far fa-circle"></i> 1 number</span>
                <span className="flex items-center gap-1"><i className="far fa-circle"></i> 1 symbol</span>
              </div>
            </div>

            {/* AI Headline Generator */}
            <div className="pt-4 border-t border-slate-100 mt-6">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-slate-700">Profile Headline</label>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold uppercase">AI Powered</span>
              </div>
              <div className="relative group">
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    placeholder="e.g. Graphic Designer, React Developer..." 
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={handleGenerateHeadline}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center gap-2 text-sm whitespace-nowrap"
                    disabled={isGenerating}
                  >
                    {isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
                    {isGenerating ? "Working..." : "Generate"}
                  </button>
                </div>
                <input 
                  type="text" 
                  placeholder="Your catchy headline will appear here..." 
                  className="w-full px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-800 placeholder-indigo-300 focus:outline-none font-medium text-sm" 
                  value={headline}
                  readOnly
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Enter your role/skill above and let AI write a professional headline for you.</p>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all text-sm">Create my account</button>
            </div>
            
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-400 font-bold">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 font-bold text-sm">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google"/> Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 font-bold text-sm">
                    <i className="fab fa-github text-xl"></i> GitHub
                </button>
            </div>

            <p className="text-xs text-center text-slate-400 mt-8">
                By clicking "Create my account", you agree to our <a href="#" className="underline hover:text-indigo-600">Terms of Service</a> and <a href="#" className="underline hover:text-indigo-600">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;