
import React, { useState, useEffect } from 'react';
import { Search, Globe, ChevronRight, MessageSquare, Info, Shield, Filter, TrendingUp, ExternalLink, Sparkles, Youtube, BookOpen, Plus, X } from 'lucide-react';
import { SafetyMode, SearchResult } from '../types';
import { searchAI } from '../services/gemini';

interface BrowserViewProps {
  safetyMode: SafetyMode;
  initialQuery?: string;
  onSearchHandled?: () => void;
}

const BrowserView: React.FC<BrowserViewProps> = ({ safetyMode, initialQuery, onSearchHandled }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  // Track grounding sources from Google Search
  const [sources, setSources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
      if (onSearchHandled) onSearchHandled();
    }
  }, [initialQuery]);

  useEffect(() => {
    const handleGlobalSearch = (e: any) => {
      const searchTerm = e.detail;
      setQuery(searchTerm);
      performSearch(searchTerm);
    };
    window.addEventListener('global-search', handleGlobalSearch);
    return () => window.removeEventListener('global-search', handleGlobalSearch);
  }, []);

  const performSearch = async (searchTerm: string) => {
    setIsLoading(true);
    setAiAnalysis(null);
    setSources([]);
    try {
      // Simulated aggregation of search results
      const mockResults: SearchResult[] = [
        { 
          title: "Premium AI Solutions for Enterprise", 
          url: "https://sponsored.ai/enterprise", 
          snippet: "Scale your business with cutting-edge MetaAI integration. Best-in-class performance and security.",
          isAd: true 
        },
        { 
          title: `${searchTerm} - Wikipedia`, 
          url: `https://en.wikipedia.org/wiki/${searchTerm.replace(/\s+/g, '_')}`, 
          snippet: `Exploring the historical and modern implications of ${searchTerm} in the context of contemporary society.` 
        },
        { 
          title: `The Future of ${searchTerm}: Expert Opinions`, 
          url: "https://tech-insights.com/ai-future", 
          snippet: "Top industry analysts weigh in on what's next for this transformative field." 
        }
      ];
      setResults(mockResults);

      const aiRes = await searchAI(searchTerm);
      setAiAnalysis(aiRes.text);
      setSources(aiRes.sources);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    performSearch(query);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'Ask WH?') {
      setQuery('What is ' + query);
      performSearch('What is ' + query);
    } else if (action === 'Summarize') {
      setQuery('Summarize ' + query);
      performSearch('Summarize ' + query);
    }
  };

  const [engines, setEngines] = useState([
    { name: 'Google', url: 'https://www.google.com', icon: <Globe className="w-4 h-4 text-blue-500" /> },
    { name: 'Bing', url: 'https://www.bing.com', icon: <Globe className="w-4 h-4 text-teal-500" /> },
    { name: 'Yahoo', url: 'https://www.yahoo.com', icon: <Globe className="w-4 h-4 text-purple-500" /> },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: <Youtube className="w-4 h-4 text-red-500" /> },
    { name: 'Perplexity', url: 'https://www.perplexity.ai', icon: <Sparkles className="w-4 h-4 text-emerald-500" /> },
    { name: 'OpenAI', url: 'https://www.openai.com', icon: <MessageSquare className="w-4 h-4 text-green-600" /> },
    { name: 'Yandex', url: 'https://yandex.com', icon: <Globe className="w-4 h-4 text-red-600" /> },
    { name: 'Naver', url: 'https://www.naver.com', icon: <Globe className="w-4 h-4 text-green-500" /> },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: <BookOpen className="w-4 h-4 text-zinc-400" /> },
    { name: 'Baidu', url: 'https://www.baidu.com', icon: <Globe className="w-4 h-4 text-blue-700" /> },
  ]);

  const [isAddingEngine, setIsAddingEngine] = useState(false);
  const [newEngineName, setNewEngineName] = useState('');
  const [newEngineUrl, setNewEngineUrl] = useState('');

  const handleAddEngine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEngineName || !newEngineUrl) return;
    
    let url = newEngineUrl;
    if (!url.startsWith('http')) url = 'https://' + url;

    setEngines([...engines, { 
      name: newEngineName, 
      url: url, 
      icon: <Globe className="w-4 h-4 text-zinc-400" /> 
    }]);
    
    setNewEngineName('');
    setNewEngineUrl('');
    setIsAddingEngine(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Search Bar Landing */}
      {!results.length && !isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl shadow-2xl shadow-blue-500/20 mb-8 flex items-center justify-center">
            <Globe className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Hyper Browser OS</h1>
          <p className="text-zinc-400 text-lg mb-8 max-w-lg">The world's most powerful AI-integrated browser with multi-engine search and native automation.</p>
          
          <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything with AI Grounding..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-14 pr-32 py-5 text-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-xl"
            />
            <button 
              type="submit"
              className="absolute right-3 top-3 bottom-3 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all transform hover:scale-105"
            >
              Search
            </button>
          </form>

          <div className="flex items-center space-x-6 mt-8 text-zinc-500">
            <span className="flex items-center space-x-1"><Shield className="w-4 h-4" /> <span>Private</span></span>
            <span className="flex items-center space-x-1"><Filter className="w-4 h-4" /> <span>Ad-Free</span></span>
            <span className="flex items-center space-x-1"><TrendingUp className="w-4 h-4" /> <span>Real-time</span></span>
          </div>

          <div className="mt-12 w-full max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em]">Global Search Engines</h3>
              <button 
                onClick={() => setIsAddingEngine(!isAddingEngine)}
                className="text-[10px] font-bold text-blue-500 uppercase tracking-wider hover:text-blue-400 transition-colors flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Engine</span>
              </button>
            </div>

            {isAddingEngine && (
              <form onSubmit={handleAddEngine} className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row gap-3 animate-in fade-in zoom-in-95 duration-300">
                <input 
                  placeholder="Engine Name"
                  value={newEngineName}
                  onChange={(e) => setNewEngineName(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-blue-500"
                />
                <input 
                  placeholder="URL (e.g. google.com)"
                  value={newEngineUrl}
                  onChange={(e) => setNewEngineUrl(e.target.value)}
                  className="flex-[2] bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-blue-500"
                />
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 transition-colors">Add</button>
                  <button type="button" onClick={() => setIsAddingEngine(false)} className="p-2 bg-zinc-800 text-zinc-400 rounded-xl hover:bg-zinc-700 transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {engines.map((engine) => (
                <a 
                  key={engine.name}
                  href={engine.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-900 transition-all group"
                >
                  <div className="p-2 bg-zinc-950 rounded-lg group-hover:scale-110 transition-transform">
                    {engine.icon}
                  </div>
                  <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">{engine.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Page */}
      {(isLoading || results.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSearch} className="relative group mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-blue-500 transition-all"
              />
            </form>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse space-y-3">
                    <div className="h-4 bg-zinc-800 rounded w-1/4" />
                    <div className="h-6 bg-zinc-800 rounded w-3/4" />
                    <div className="h-4 bg-zinc-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              results.map((res, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border transition-all ${res.isAd ? 'bg-blue-500/5 border-blue-500/20' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}>
                  {res.isAd && <span className="text-[10px] font-bold text-blue-500 uppercase mb-2 block">Sponsored</span>}
                  <a href={res.url} target="_blank" className="group">
                    <h3 className="text-xl font-bold text-blue-400 group-hover:underline mb-1 flex items-center">
                      {res.title} <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                  </a>
                  <p className="text-zinc-500 text-sm mb-3 truncate">{res.url}</p>
                  <p className="text-zinc-300 leading-relaxed">{res.snippet}</p>
                </div>
              ))
            )}
          </div>

          {/* AI Panel */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-white uppercase tracking-wider text-xs">AI Knowledge Pane</span>
                </div>
                <div className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-500 font-bold uppercase">MetaAI Pro</div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-4 bg-zinc-800 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-zinc-800 rounded animate-pulse w-4/6" />
                  <div className="h-32 bg-zinc-800 rounded animate-pulse" />
                </div>
              ) : (
                <div className="space-y-6">
                  {aiAnalysis ? (
                    <>
                      <div className="prose prose-invert prose-sm">
                        <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">{aiAnalysis}</p>
                      </div>

                      {/* Grounding Sources - Mandatory as per Google GenAI guidelines */}
                      {sources.length > 0 && (
                        <div className="pt-6 border-t border-zinc-800">
                          <h4 className="text-xs font-bold text-zinc-500 uppercase mb-4">Sources</h4>
                          <div className="space-y-2">
                            {sources.map((source, i) => {
                              const uri = source.web?.uri || source.maps?.uri;
                              const title = source.web?.title || source.maps?.title || 'Source';
                              if (!uri) return null;
                              return (
                                <a 
                                  key={i} 
                                  href={uri} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 text-xs text-blue-400 hover:underline truncate"
                                >
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                  <span>{title}</span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="pt-6 border-t border-zinc-800">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase mb-4">Quick Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <QuickAction icon={<MessageSquare className="w-4 h-4" />} label="Ask WH?" onClick={() => handleQuickAction('Ask WH?')} />
                          <QuickAction icon={<Info className="w-4 h-4" />} label="Summarize" onClick={() => handleQuickAction('Summarize')} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Sparkles className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                      <p className="text-zinc-500 text-sm">Enter a query to see AI insights</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const QuickAction: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center space-x-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 transition-colors"
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default BrowserView;
