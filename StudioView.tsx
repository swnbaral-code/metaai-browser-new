
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Layers, 
  Download, 
  RefreshCw,
  Loader2,
  Trash2,
  Maximize2
} from 'lucide-react';
import { generateImage, generateVideo, imageToVideo, complexQuery } from '../services/gemini';

const StudioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'video'>('text');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcess = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      if (activeTab === 'text') {
        const res = await complexQuery(prompt);
        setResult({ type: 'text', content: res });
      } else if (activeTab === 'image') {
        const res = await generateImage(prompt, '16:9', '1K');
        setResult({ type: 'image', content: res });
      } else if (activeTab === 'video') {
        let res;
        if (uploadedImage) {
          res = await imageToVideo(prompt, uploadedImage);
        } else {
          res = await generateVideo(prompt);
        }
        setResult({ type: 'video', content: res });
      }
    } catch (err: any) {
      console.error(err);
      if (err?.message?.includes('Requested entity was not found')) {
        setError("Selected API key is invalid or not found. Please select a valid paid key.");
        if (window.aistudio?.openSelectKey) {
          await window.aistudio.openSelectKey();
        }
      } else {
        setError("Error generating content: " + (err.message || "Unknown error"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [error, setError] = useState<string | null>(null);

  const handleExport = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.content;
    link.download = `meta-ai-${activeTab}-${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 animate-in fade-in duration-500">
      <div className="flex-1 overflow-auto p-6 md:p-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Input Controls */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <h2 className="text-3xl font-black text-white mb-2 flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-blue-500" />
              AI Studio
            </h2>
            <p className="text-zinc-500">Create production-ready assets with Gemini Pro & Veo.</p>
          </div>

          {/* Mode Selector */}
          <div className="bg-zinc-900 p-1.5 rounded-2xl flex border border-zinc-800">
            <ModeTab 
              active={activeTab === 'text'} 
              onClick={() => setActiveTab('text')} 
              icon={<FileText className="w-4 h-4" />} 
              label="Text" 
            />
            <ModeTab 
              active={activeTab === 'image'} 
              onClick={() => setActiveTab('image')} 
              icon={<ImageIcon className="w-4 h-4" />} 
              label="Image" 
            />
            <ModeTab 
              active={activeTab === 'video'} 
              onClick={() => setActiveTab('video')} 
              icon={<Video className="w-4 h-4" />} 
              label="Video" 
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Detailed Prompt</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Describe your ${activeTab} in detail...`}
              className="w-full h-40 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-zinc-200 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {activeTab === 'video' && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Reference Image (Optional)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 transition-colors group relative overflow-hidden"
              >
                {uploadedImage ? (
                  <>
                    <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Trash2 className="w-6 h-6 text-white" onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }} />
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-zinc-700 mb-2 group-hover:text-zinc-500 transition-colors" />
                    <span className="text-sm text-zinc-600">Upload starting frame</span>
                  </>
                )}
                <input type="file" ref={fileInputRef} hidden onChange={handleImageUpload} accept="image/*" />
              </div>
            </div>
          )}

          <button 
            onClick={handleProcess}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-3"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
            <span>{isLoading ? 'Generating...' : 'Generate Magic'}</span>
          </button>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <RefreshCw className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Output Canvas */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={result ? 'result' : isLoading ? 'loading' : 'empty'}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden relative min-h-[500px] flex items-center justify-center"
            >
              {!result && !isLoading && (
              <div className="text-center p-12">
                <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Layers className="w-10 h-10 text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold text-zinc-400 mb-2">Studio Preview</h3>
                <p className="text-zinc-600 max-w-sm mx-auto">Your generated assets will appear here. Start by writing a prompt on the left.</p>
              </div>
            )}

            {isLoading && (
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-blue-400 font-bold animate-pulse uppercase tracking-widest text-sm">Processing Neural Frames...</p>
              </div>
            )}

            {result && (
              <div className="w-full h-full flex flex-col p-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 bg-zinc-950 rounded-2xl overflow-hidden flex items-center justify-center p-4"
                >
                  {result.type === 'text' && (
                    <div className="w-full h-full overflow-auto prose prose-invert p-8 max-w-none">
                      <p className="whitespace-pre-wrap text-lg leading-relaxed">{result.content}</p>
                    </div>
                  )}
                  {result.type === 'image' && (
                    <img src={result.content} alt="Generated" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-black/50" />
                  )}
                  {result.type === 'video' && (
                    <video src={result.content} controls autoPlay loop className="max-w-full max-h-full rounded-lg shadow-2xl shadow-black/50" />
                  )}
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex-items-center justify-between mt-4 px-2"
                >
                  <div className="flex items-center space-x-2">
                    <button className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors">
                      <Maximize2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleProcess}
                      className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                  <button 
                    onClick={handleExport}
                    className="flex items-center space-x-2 px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-bold transition-all transform hover:scale-105"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export</span>
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ModeTab: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl transition-all font-bold text-sm ${active ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default StudioView;
