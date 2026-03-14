
import React, { useState, useEffect } from 'react';
import { Hash, MessageSquare, Plus, Users, Shield, Send, Mic, Paperclip, Smile, MoreHorizontal } from 'lucide-react';

const CommunityView: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: '1', user: 'AI_Researcher', content: 'Anyone tried the new Veo video generation parameters?', timestamp: Date.now() - 1000 * 60 * 60 * 2, avatar: 'https://picsum.photos/32/32?random=1' },
    { id: '2', user: 'CodeMaster', content: 'Yeah, the 1080p outputs are incredibly crisp.', timestamp: Date.now() - 1000 * 60 * 30, avatar: 'https://picsum.photos/32/32?random=2' },
    { id: '3', user: 'UI_Gal', content: 'The n8n-style automation nodes are a game changer.', timestamp: Date.now() - 1000 * 60 * 5, avatar: 'https://picsum.photos/32/32?random=3' },
  ]);
  const [input, setInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);

  // 24-hour auto-delete logic simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setMessages(prev => prev.filter(msg => now - msg.timestamp < 1000 * 60 * 60 * 24));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      user: 'Me',
      content: input,
      timestamp: Date.now(),
      avatar: 'https://picsum.photos/32/32?random=4'
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="h-full flex bg-zinc-950 overflow-hidden relative">
      {/* Rooms Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 transition-transform duration-300 lg:relative lg:translate-x-0 ${showSidebar ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-500" />
            Social Hub
          </h2>
          <button onClick={() => setShowSidebar(false)} className="lg:hidden text-zinc-500">
            <Plus className="w-5 h-5 rotate-45" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          <RoomGroup title="Public Channels" rooms={['General', 'AI-Hacks', 'Marketplace', 'Prompts']} active="General" />
          <RoomGroup title="Private Rooms" rooms={['Dev-Team', 'Enterprise-Alpha']} />
          <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800">
            <div className="flex items-center space-x-2 text-orange-400 mb-2">
              <Shield className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Privacy Guard</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-tight">All messages are automatically purged after 24 hours of inactivity.</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-950 min-w-0">
        <div className="h-16 px-4 md:px-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <button 
              onClick={() => setShowSidebar(true)}
              className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-white"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <Hash className="w-5 h-5 text-zinc-500 shrink-0" />
            <h3 className="font-bold text-white truncate">General</h3>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
            <span className="text-xs text-zinc-500 hidden sm:inline">12,402 online</span>
          </div>
          <div className="flex items-center space-x-3 md:space-x-4">
            <Users className="w-4 h-4 text-zinc-500 hover:text-white cursor-pointer" />
            <Plus className="w-4 h-4 text-zinc-500 hover:text-white cursor-pointer" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start space-x-3 md:space-x-4 group">
              <img src={msg.avatar} alt={msg.user} className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-zinc-800 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`font-bold text-xs md:text-sm ${msg.user === 'Me' ? 'text-blue-400' : 'text-zinc-200'}`}>{msg.user}</span>
                  <span className="text-[9px] md:text-[10px] text-zinc-600 font-medium">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-zinc-300 text-sm md:text-base leading-relaxed break-words">{msg.content}</p>
              </div>
              <MoreHorizontal className="w-4 h-4 text-zinc-700 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity shrink-0" />
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 md:p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 md:p-2 flex items-center space-x-1 md:space-x-2 shadow-2xl">
            <button className="p-2 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 rounded-lg transition-colors hidden xs:block">
              <Paperclip className="w-5 h-5" />
            </button>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message #General"
              className="flex-1 bg-transparent border-none outline-none py-2 text-zinc-200 text-sm placeholder-zinc-600 min-w-0"
            />
            <div className="flex items-center space-x-1 pr-1 md:pr-2">
              <button className="p-2 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 rounded-lg transition-colors hidden sm:block">
                <Smile className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 rounded-lg transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSend}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoomGroup: React.FC<{ title: string; rooms: string[]; active?: string }> = ({ title, rooms, active }) => (
  <div className="space-y-1">
    <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2 mb-2">{title}</h4>
    {rooms.map((room) => (
      <div 
        key={room}
        className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${room === active ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}
      >
        <div className="flex items-center space-x-3">
          <Hash className="w-4 h-4 opacity-70" />
          <span className="text-sm">{room}</span>
        </div>
        {room === 'General' && <div className="px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-black rounded uppercase">Live</div>}
      </div>
    ))}
  </div>
);

export default CommunityView;
