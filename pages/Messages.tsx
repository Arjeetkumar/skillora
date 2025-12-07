import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../services/mockBackend';
import { Message, ChatContact } from '../types';

const Messages: React.FC = () => {
  const location = useLocation();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [userRole, setUserRole] = useState<'client' | 'freelancer'>('freelancer');

  useEffect(() => {
    // Determine dashboard link
    const user = api.getCurrentUser();
    if (user) setUserRole(user.role);

    const fetchData = async () => {
      const contactData = await api.getContacts();
      setContacts(contactData);
      
      // Check for state from navigation (e.g. from Client Dashboard "Message" button)
      const stateContactId = location.state?.contactId;
      if (stateContactId) {
          setActiveContactId(stateContactId);
      } else if (contactData.length > 0) {
        setActiveContactId(contactData[0].id);
      }
    };
    fetchData();
  }, [location.state]);

  useEffect(() => {
    if (activeContactId) {
      setMessages([]); // Clear previous messages while loading
      const fetchMessages = async () => {
        const msgs = await api.getMessages(activeContactId);
        setMessages(msgs);
      };
      fetchMessages();
    }
  }, [activeContactId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeContactId) return;
    
    // Optimistic Update
    const tempMessage: Message = {
      id: Math.random().toString(),
      senderId: 'me',
      text: inputMessage,
      timestamp: 'Now',
      isMe: true
    };
    setMessages(prev => [...prev, tempMessage]);
    setInputMessage('');

    // Call Mock API
    await api.sendMessage(activeContactId, tempMessage.text);
  };

  const activeContact = contacts.find(c => c.id === activeContactId);

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 shrink-0">
            <div className="flex items-center gap-12">
                <Link to={userRole === 'client' ? '/client-dashboard' : '/dashboard'} className="flex items-center gap-3 text-indigo-600 group">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">S</div>
                    <span className="text-lg font-bold text-slate-900 tracking-tight">Skillora</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
                    <Link to={userRole === 'client' ? '/client-dashboard' : '/dashboard'} className="hover:text-indigo-600 transition-colors">Dashboard</Link>
                    <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full">Messages</span>
                </nav>
            </div>
            <div className="flex items-center gap-4">
               <img src="https://i.pravatar.cc/150?u=client_boss" alt="User" className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" />
            </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
            <aside className="w-80 bg-white border-r border-slate-200 flex flex-col z-10 hidden md:flex">
                <div className="p-4 border-b border-slate-100">
                    <input type="text" placeholder="Search..." className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm focus:outline-none"/>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {contacts.map(contact => (
                        <div 
                            key={contact.id} 
                            onClick={() => setActiveContactId(contact.id)}
                            className={`p-3 m-2 rounded-xl cursor-pointer flex gap-3 ${activeContactId === contact.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}
                        >
                            <div className="relative shrink-0">
                                <img src={contact.avatar} className="w-10 h-10 rounded-full object-cover"/>
                                {contact.isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-sm font-bold text-slate-900 truncate">{contact.name}</h3>
                                    <span className="text-[10px] text-slate-400">{contact.lastMessageTime}</span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">{contact.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            <main className="flex-1 flex flex-col bg-slate-50/50 relative">
                {activeContact ? (
                    <>
                    <div className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={activeContact.avatar} className="w-9 h-9 rounded-full object-cover border border-slate-100"/>
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    {activeContact.name}
                                    <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">{activeContact.role}</span>
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex gap-3 max-w-[80%] ${msg.isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                                <img src={msg.isMe ? "https://i.pravatar.cc/150?u=client_boss" : activeContact.avatar} className="w-8 h-8 rounded-full object-cover mt-auto mb-1"/>
                                <div className="space-y-1">
                                    <div className={`p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'}`}>
                                        {msg.text}
                                    </div>
                                    <div className={`text-[10px] text-slate-400 font-medium ${msg.isMe ? 'text-right mr-1' : 'ml-1'}`}>{msg.timestamp}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                        <div className="max-w-4xl mx-auto relative bg-slate-50 border border-slate-200 rounded-2xl p-2 flex items-end gap-2">
                             <textarea 
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                rows={1}
                                className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 py-2.5 text-sm resize-none"
                                placeholder="Type a message..."
                             ></textarea>
                             <button onClick={handleSendMessage} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-9 w-9 flex items-center justify-center shadow-md shadow-indigo-200 mb-1">
                                <i className="fas fa-paper-plane text-xs"></i>
                             </button>
                        </div>
                    </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400">Select a conversation</div>
                )}
            </main>
        </div>
    </div>
  );
};

export default Messages;