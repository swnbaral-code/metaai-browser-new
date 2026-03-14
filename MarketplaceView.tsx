
import React, { useState } from 'react';
import { ShoppingBag, Star, Download, Search, Plus, ExternalLink, Code, Layers, Boxes, X, CheckCircle2, Settings, Shield, Zap, Music, Video, Globe, Layout, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MarketplaceView: React.FC = () => {
  const apps = [
    { id: 'playit', name: 'PLAYit All-in-One', author: 'PLAYit Team', type: 'Media Player', price: 0, rating: 4.8, downloads: '100M+', icon: 'https://picsum.photos/64/64?random=20' },
    { id: 'soul', name: 'Soul Browser', author: 'SoulSoft', type: 'Browser', price: 0, rating: 4.9, downloads: '10M+', icon: 'https://picsum.photos/64/64?random=21' },
    { id: '1', name: 'SEO Architect Pro', author: 'RankLogic', type: 'Extension', price: 12.99, rating: 4.8, downloads: '12K', icon: 'https://picsum.photos/64/64?random=10' },
    { id: '2', name: 'Neural Stock Tracker', author: 'QuantAI', type: 'Mini-App', price: 0, rating: 4.9, downloads: '45K', icon: 'https://picsum.photos/64/64?random=11' },
    { id: '3', name: 'Github Commit Bot', author: 'DevHelpers', type: 'API Tool', price: 5.00, rating: 4.5, downloads: '8K', icon: 'https://picsum.photos/64/64?random=12' },
    { id: '4', name: 'Hugging Face Wrapper', author: 'ML_Studio', type: 'Extension', price: 0, rating: 4.7, downloads: '22K', icon: 'https://picsum.photos/64/64?random=13' },
    { id: '5', name: 'Crypto Sentinel', author: 'ChainScan', type: 'Tool', price: 19.99, rating: 4.6, downloads: '5K', icon: 'https://picsum.photos/64/64?random=14' },
    { id: '6', name: 'Diagram Builder AI', author: 'VisualNodes', type: 'Mini-App', price: 2.50, rating: 4.9, downloads: '92K', icon: 'https://picsum.photos/64/64?random=15' },
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
      {/* Featured Banner */}
      <div className="p-4 md:p-8 lg:p-12">
        <div className="relative min-h-[200px] md:h-64 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl md:rounded-[32px] overflow-hidden flex items-center px-6 md:px-12 group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="relative z-10 max-w-xl py-8 md:py-0">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-wider mb-4 inline-block">Featured Storefront</span>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">Empower your browser with AI-native extensions.</h2>
            <button className="px-6 md:px-8 py-2 md:py-3 bg-white text-zinc-950 rounded-xl md:rounded-2xl font-black hover:scale-105 transition-transform text-sm md:text-base">Explore Bundles</button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <Boxes className="w-48 h-48 text-white/10 rotate-12" />
          </div>
        </div>
      </div>

      {/* Categories & Search */}
      <div className="px-4 md:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar no-scrollbar">
          <CategoryChip label="All Apps" active />
          <CategoryChip label="AI Tools" />
          <CategoryChip label="Developer" />
          <CategoryChip label="Security" />
          <CategoryChip label="Games" />
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              placeholder="Search store..." 
              className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-200 focus:border-blue-500 outline-none transition-all w-full sm:w-64"
            />
          </div>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-bold transition-all">
            <Plus className="w-4 h-4" />
            <span>Publish</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 md:px-8 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div key={app.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-blue-500/50 transition-all group flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <img src={app.icon} alt={app.name} className="w-16 h-16 rounded-2xl bg-zinc-800 shadow-xl" />
              <div className="flex flex-col items-end">
                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${app.price === 0 ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {app.price === 0 ? 'Free' : `$${app.price}`}
                </span>
                <div className="flex items-center space-x-1 mt-2 text-zinc-500 text-xs font-bold">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span>{app.rating}</span>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{app.name}</h3>
            <p className="text-zinc-500 text-sm mb-6">By {app.author} • {app.type}</p>
            
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-800">
              <div className="flex items-center space-x-2 text-zinc-500 text-xs">
                <Download className="w-4 h-4" />
                <span>{app.downloads} users</span>
              </div>
              <button className="flex items-center space-x-2 text-white font-bold text-sm bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl transition-colors">
                <span>Install</span>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryChip: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <button className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
    {label}
  </button>
);

export default MarketplaceView;
