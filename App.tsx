
import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Sparkles, 
  Workflow, 
  Store, 
  Users, 
  Settings, 
  ShieldAlert, 
  Search,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  User,
  Bell,
  Wallet,
  Monitor,
  Key,
  AppWindow,
  Activity
} from 'lucide-react';
import { ViewMode, SafetyMode } from './types';
import BrowserView from './views/BrowserView';
import StudioView from './views/StudioView';
import AutomationView from './views/AutomationView';
import MarketplaceView from './views/MarketplaceView';
import CommunityView from './views/CommunityView';
import SettingsView from './views/SettingsView';
import CrawlerView from './views/CrawlerView';
import AppsView from './views/AppsView';
import VectorProcessorView from './views/VectorProcessorView';
import { Bug } from 'lucide-react';

// TypeScript declaration for window.aistudio extension
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.BROWSER);
  const [safetyMode, setSafetyMode] = useState<SafetyMode>(SafetyMode.NORMAL);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [pendingSearch, setPendingSearch] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Initial check for API key selection
    const checkKey = async () => {
      try {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } catch (e) {
        setHasApiKey(false);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // Open selection dialog and assume success as per race condition guidelines
    await window.aistudio.openSelectKey();
    setHasApiKey(true);
  };

  const toggleSafetyMode = () => {
    if (safetyMode === SafetyMode.NORMAL) {
      setIsWarningVisible(true);
      setCountdown(6);
    } else {
      setSafetyMode(SafetyMode.NORMAL);
    }
  };

  useEffect(() => {
    let timer: any;
    if (isWarningVisible && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (isWarningVisible && countdown === 0) {
      setSafetyMode(SafetyMode.UNRESTRICTED);
      setIsWarningVisible(false);
    }
    return () => clearInterval(timer);
  }, [isWarningVisible, countdown]);

  // Mandatory block for API key selection before accessing the app's advanced models
  if (hasApiKey === false) {
    return (
      <div className="flex h-screen w-full bg-zinc-950 items-center justify-center p-6 text-zinc-300">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-center shadow-2xl">
          <Key className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">API Key Required</h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            To use advanced features like Veo video generation and high-quality image editing, you must select a paid API key from a Google Cloud project with billing enabled.
          </p>
          <div className="flex flex-col space-y-4">
            <button 
              onClick={handleSelectKey}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all transform hover:scale-[1.02]"
            >
              Select API Key
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-4"
            >
              Learn more about billing
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      setPendingSearch(globalSearch);
      setActiveView(ViewMode.BROWSER);
      // Still dispatch for any other listeners, but prop is primary for BrowserView
      window.dispatchEvent(new CustomEvent('global-search', { detail: globalSearch }));
    }
  };

  const renderView = () => {
    switch (activeView) {
      case ViewMode.BROWSER: return (
        <BrowserView 
          safetyMode={safetyMode} 
          initialQuery={pendingSearch} 
          onSearchHandled={() => setPendingSearch(undefined)} 
        />
      );
      case ViewMode.STUDIO: return <StudioView />;
      case ViewMode.AUTOMATION: return <AutomationView />;
      case ViewMode.MARKETPLACE: return <MarketplaceView />;
      case ViewMode.COMMUNITY: return <CommunityView />;
      case ViewMode.SETTINGS: return <SettingsView />;
      case ViewMode.CRAWLER: return <CrawlerView />;
      case ViewMode.APPS: return <AppsView />;
      case ViewMode.VECTOR: return <VectorProcessorView />;
      default: return <BrowserView safetyMode={safetyMode} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-zinc-950 overflow-hidden text-zinc-300">
      {/* Sidebar Navigation - Desktop */}
      <nav className="hidden md:flex w-20 bg-zinc-900 border-r border-zinc-800 flex-col items-center py-6 space-y-8 z-50">
        <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 mb-4">
          <Monitor className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 space-y-4 w-full flex flex-col items-center">
          <NavButton 
            icon={<Globe className="w-5 h-5" />} 
            active={activeView === ViewMode.BROWSER} 
            onClick={() => setActiveView(ViewMode.BROWSER)} 
            label="Browser"
          />
          <NavButton 
            icon={<AppWindow className="w-5 h-5" />} 
            active={activeView === ViewMode.APPS} 
            onClick={() => setActiveView(ViewMode.APPS)} 
            label="Apps"
          />
          <NavButton 
            icon={<Activity className="w-5 h-5" />} 
            active={activeView === ViewMode.VECTOR} 
            onClick={() => setActiveView(ViewMode.VECTOR)} 
            label="Vector"
          />
          <NavButton 
            icon={<Sparkles className="w-5 h-5" />} 
            active={activeView === ViewMode.STUDIO} 
            onClick={() => setActiveView(ViewMode.STUDIO)} 
            label="Studio"
          />
          <NavButton 
            icon={<Workflow className="w-5 h-5" />} 
            active={activeView === ViewMode.AUTOMATION} 
            onClick={() => setActiveView(ViewMode.AUTOMATION)} 
            label="Nodes"
          />
          <NavButton 
            icon={<Bug className="w-5 h-5" />} 
            active={activeView === ViewMode.CRAWLER} 
            onClick={() => setActiveView(ViewMode.CRAWLER)} 
            label="Crawler"
          />
          <NavButton 
            icon={<Store className="w-5 h-5" />} 
            active={activeView === ViewMode.MARKETPLACE} 
            onClick={() => setActiveView(ViewMode.MARKETPLACE)} 
            label="Market"
          />
          <NavButton 
            icon={<Users className="w-5 h-5" />} 
            active={activeView === ViewMode.COMMUNITY} 
            onClick={() => setActiveView(ViewMode.COMMUNITY)} 
            label="Social"
          />
        </div>

        <div className="space-y-4 w-full flex flex-col items-center">
          <NavButton 
            icon={<Settings className="w-5 h-5" />} 
            active={activeView === ViewMode.SETTINGS} 
            onClick={() => setActiveView(ViewMode.SETTINGS)} 
            label="Settings"
          />
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center cursor-pointer border border-zinc-700 hover:border-zinc-500 transition-colors">
            <User className="w-4 h-4" />
          </div>
        </div>
      </nav>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 flex items-center justify-around h-16 z-50 px-2">
        <MobileNavButton 
          icon={<Globe className="w-5 h-5" />} 
          active={activeView === ViewMode.BROWSER} 
          onClick={() => setActiveView(ViewMode.BROWSER)} 
        />
        <MobileNavButton 
          icon={<AppWindow className="w-5 h-5" />} 
          active={activeView === ViewMode.APPS} 
          onClick={() => setActiveView(ViewMode.APPS)} 
        />
        <MobileNavButton 
          icon={<Activity className="w-5 h-5" />} 
          active={activeView === ViewMode.VECTOR} 
          onClick={() => setActiveView(ViewMode.VECTOR)} 
        />
        <MobileNavButton 
          icon={<Sparkles className="w-5 h-5" />} 
          active={activeView === ViewMode.STUDIO} 
          onClick={() => setActiveView(ViewMode.STUDIO)} 
        />
        <MobileNavButton 
          icon={<Bug className="w-5 h-5" />} 
          active={activeView === ViewMode.CRAWLER} 
          onClick={() => setActiveView(ViewMode.CRAWLER)} 
        />
        <MobileNavButton 
          icon={<Store className="w-5 h-5" />} 
          active={activeView === ViewMode.MARKETPLACE} 
          onClick={() => setActiveView(ViewMode.MARKETPLACE)} 
        />
        <MobileNavButton 
          icon={<Users className="w-5 h-5" />} 
          active={activeView === ViewMode.COMMUNITY} 
          onClick={() => setActiveView(ViewMode.COMMUNITY)} 
        />
        <MobileNavButton 
          icon={<Settings className="w-5 h-5" />} 
          active={activeView === ViewMode.SETTINGS} 
          onClick={() => setActiveView(ViewMode.SETTINGS)} 
        />
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative pb-16 md:pb-0">
        {/* Top Navigation Bar */}
        <header className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 space-x-2 md:space-x-4 shrink-0">
          <div className="hidden sm:flex items-center space-x-2 text-zinc-500">
            <ArrowLeft className="w-4 h-4 cursor-pointer hover:text-white" />
            <ArrowRight className="w-4 h-4 cursor-pointer hover:text-white" />
            <RotateCcw className="w-4 h-4 cursor-pointer hover:text-white" />
          </div>

          <form onSubmit={handleGlobalSearch} className="flex-1 flex items-center bg-zinc-950 border border-zinc-800 rounded-full px-4 py-1.5 focus-within:border-blue-500 transition-all">
            <Search className="w-4 h-4 text-zinc-500 mr-2" />
            <input 
              type="text" 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search or enter URL" 
              className="bg-transparent border-none outline-none flex-1 text-sm text-zinc-200 placeholder-zinc-600"
            />
          </form>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div 
              onClick={toggleSafetyMode}
              className={`flex items-center space-x-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                safetyMode === SafetyMode.NORMAL 
                  ? 'bg-green-500/10 text-green-500 border border-green-500/30' 
                  : 'bg-red-500/10 text-red-500 border border-red-500/30'
              }`}
            >
              <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${safetyMode === SafetyMode.NORMAL ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider">
                {safetyMode}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-3 text-zinc-400">
              <Wallet className="w-4 h-4 cursor-pointer hover:text-white hidden xs:block" />
              <Bell className="w-4 h-4 cursor-pointer hover:text-white" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-zinc-950">
          {renderView()}
        </div>

        {/* 18+ Warning Modal */}
        {isWarningVisible && (
          <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center shadow-2xl">
              <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Warning: Restricted Mode</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                You are entering Unrestricted Mode (18+). This area may contain sensitive or adult content. 
                Please ensure you are over 18 and accept our terms of service.
              </p>
              <div className="flex flex-col space-y-4">
                <div className="text-4xl font-black text-red-500 mb-2">{countdown}s</div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setIsWarningVisible(false)}
                    className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={countdown > 0}
                    onClick={() => {
                      setSafetyMode(SafetyMode.UNRESTRICTED);
                      setIsWarningVisible(false);
                    }}
                    className={`flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors font-medium ${countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`relative group w-full flex flex-col items-center justify-center py-2 transition-all ${active ? 'text-blue-400' : 'text-zinc-500 hover:text-zinc-300'}`}
  >
    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full shadow-lg shadow-blue-500/50" />}
    <div className={`p-2 rounded-lg transition-colors ${active ? 'bg-blue-500/10' : 'group-hover:bg-zinc-800'}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium mt-1 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
      {label}
    </span>
  </button>
);

const MobileNavButton: React.FC<Omit<NavButtonProps, 'label'>> = ({ icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center py-2 transition-all ${active ? 'text-blue-400' : 'text-zinc-500'}`}
  >
    <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-blue-500/10' : ''}`}>
      {icon}
    </div>
    {active && <div className="w-1 h-1 bg-blue-500 rounded-full mt-1 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
  </button>
);

export default App;
