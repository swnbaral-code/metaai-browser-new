
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Globe, Link2, FileText, Loader2, Sparkles, ArrowRight, ExternalLink, Bug, CheckCircle2, History, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const CrawlerView: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlResult, setCrawlResult] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visitedUrls, setVisitedUrls] = useState<Set<string>>(new Set());
  const [showHistory, setShowHistory] = useState(false);

  const handleCrawl = async (e?: React.FormEvent, targetUrl?: string) => {
    if (e) e.preventDefault();
    const crawlUrl = targetUrl || url;
    if (!crawlUrl.trim()) return;

    setIsCrawling(true);
    setError(null);
    setCrawlResult(null);
    setAiAnalysis(null);
    setShowHistory(false); // Close history on mobile when starting a crawl

    try {
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: crawlUrl })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to crawl');
      }

      const data = await response.json();
      setCrawlResult(data);
      setVisitedUrls(prev => new Set(prev).add(crawlUrl));
      if (targetUrl) setUrl(targetUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCrawling(false);
    }
  };

  const clearHistory = () => {
    setVisitedUrls(new Set());
  };

  const handleAIAnalyze = async () => {
    if (!crawlResult || !crawlResult.content) return;

    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following website content from ${crawlResult.url}. Provide a summary, key topics, and potential insights.\n\nContent: ${crawlResult.content.substring(0, 10000)}`,
        config: {
          systemInstruction: "You are a web analysis expert. Provide concise, professional insights."
        }
      });
      setAiAnalysis(response.text);
    } catch (err: any) {
      console.error(err);
      setError("AI Analysis failed: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Bug className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white leading-tight">Spider Crawler</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold hidden xs:block">Internet Indexing & Extraction</p>
          </div>
        </div>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="lg:hidden p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors"
        >
          <History className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Left Column: Input & Results */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl"
              >
                <form onSubmit={(e) => handleCrawl(e)} className="space-y-4">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Target URL</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                      <input 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 md:py-4 text-sm md:text-base text-white outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isCrawling}
                      className="px-6 md:px-8 py-3 md:py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all flex items-center justify-center space-x-2"
                    >
                      {isCrawling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                      <span>{isCrawling ? 'Crawling...' : 'Start Spider'}</span>
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}
              </motion.div>

              {/* Results Section */}
              <AnimatePresence>
                {crawlResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    className="space-y-6"
                  >
                    {/* Metadata */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-emerald-500" />
                      Page Metadata
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Title</span>
                        <p className="text-zinc-200 font-medium">{crawlResult.title || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Description</span>
                        <p className="text-zinc-400 text-sm leading-relaxed">{crawlResult.description || 'No description found.'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content & AI */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-emerald-500" />
                        Extracted Content
                      </h3>
                      <button 
                        onClick={handleAIAnalyze}
                        disabled={isAnalyzing}
                        className="flex items-center space-x-2 px-4 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 rounded-lg text-xs font-bold transition-all border border-emerald-500/20"
                      >
                        {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        <span>AI Analyze</span>
                      </button>
                    </div>
                    
                    {aiAnalysis ? (
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mb-6">
                        <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">{aiAnalysis}</p>
                      </div>
                    ) : null}

                    <div className="max-h-96 overflow-y-auto custom-scrollbar bg-zinc-950 rounded-xl p-4 border border-zinc-800">
                      <p className="text-zinc-400 text-xs leading-relaxed font-mono">
                        {crawlResult.content || 'No text content extracted.'}
                      </p>
                    </div>
                  </div>

                  {/* Discovered Links */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <Link2 className="w-5 h-5 mr-2 text-emerald-500" />
                      Discovered Links ({crawlResult.links.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {crawlResult.links.map((link: string, i: number) => {
                        const isVisited = visitedUrls.has(link);
                        return (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`group flex items-center justify-between p-3 bg-zinc-950 border rounded-xl transition-all ${isVisited ? 'border-emerald-500/20 bg-emerald-500/[0.02]' : 'border-zinc-800 hover:border-emerald-500/30'}`}
                          >
                            <div className="flex items-center min-w-0 flex-1 mr-2">
                              {isVisited && <CheckCircle2 className="w-3 h-3 text-emerald-500 mr-2 shrink-0" />}
                              <span className={`text-xs truncate ${isVisited ? 'text-zinc-500' : 'text-zinc-400'}`}>{link}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleCrawl(undefined, link)}
                                className={`p-1.5 rounded-lg transition-colors ${isVisited ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white'}`}
                                title={isVisited ? "Re-crawl this link" : "Crawl this link"}
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                              <a 
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                    {crawlResult.links.length === 0 && (
                      <p className="text-center py-8 text-zinc-600 text-sm">No external links found.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

            {/* Right Column: History */}
            <div className={`lg:col-span-4 ${showHistory ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <History className="w-5 h-5 mr-2 text-emerald-500" />
                    Crawl History
                  </h3>
                  {visitedUrls.size > 0 && (
                    <button 
                      onClick={clearHistory}
                      className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Clear History"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3 max-h-[40vh] lg:max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar pr-2">
                  {Array.from(visitedUrls).reverse().map((vUrl, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleCrawl(undefined, vUrl as string)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all group ${vUrl === crawlResult?.url ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Globe className="w-3 h-3 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                        <ArrowRight className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                      <p className="text-[10px] text-zinc-400 truncate font-mono">{vUrl}</p>
                    </div>
                  ))}
                  {visitedUrls.size === 0 && (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                        <History className="w-6 h-6 text-zinc-800" />
                      </div>
                      <p className="text-zinc-600 text-sm">No visited links yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrawlerView;
