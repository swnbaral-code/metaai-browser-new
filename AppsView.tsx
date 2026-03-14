import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AppWindow, 
  Search, 
  Grid, 
  List, 
  Settings, 
  Shield, 
  Zap, 
  Music, 
  Video, 
  Globe, 
  Layout, 
  CheckCircle2, 
  X, 
  Download, 
  Maximize2, 
  RefreshCw,
  MoreVertical,
  Play,
  Smartphone,
  Lock,
  EyeOff,
  Languages,
  Volume2,
  Sun,
  FastForward,
  Clock,
  Type,
  MousePointer2
} from 'lucide-react';

const AppsView: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const installedApps = [
    { 
      id: 'playit', 
      name: 'PLAYit All-in-One', 
      author: 'PLAYit Team', 
      type: 'Media Player', 
      icon: 'https://picsum.photos/64/64?random=20',
      description: 'PLAYit ହେଉଛି ଏକ All-in-one ମିଡ଼ିଆ ପ୍ଲେୟାର୍, ଯାହା ଭିଡିଓ ପ୍ଲେୟାର୍, ମ୍ୟୁଜିକ୍ ପ୍ଲେୟାର୍, ଏବଂ ଭିଡିଓ ଡାଉନଲୋଡର୍ ଭାବରେ କାମ କରେ।',
      features: [
        { 
          title: 'Video Player (ଭିଡିଓ ପ୍ଲେୟାର୍)', 
          icon: <Video className="w-5 h-5 text-blue-500" />,
          items: [
            'All Format Support: MKV, MP4, M4V, AVI, FLV, ଏବଂ 4K ସପୋର୍ଟ।',
            'Smart Gesture Control: Brightness (Left swipe), Volume (Right swipe), Progress (Middle swipe)।',
            'Floating Play (PIP Mode): ଅନ୍ୟ ଆପ୍ ବ୍ୟବହାର କରିବା ସମୟରେ ଛୋଟ ୱିଣ୍ଡୋରେ ଭିଡିଓ।',
            'Background Play: ଭିଡିଓକୁ ଅଡିଓ ଭାବେ ବ୍ୟାକଗ୍ରାଉଣ୍ଡରେ ଶୁଣନ୍ତୁ।',
            'Playback Speed: 0.5x ରୁ 2.0x ସ୍ପିଡ୍ କଣ୍ଟ୍ରୋଲ୍।'
          ] 
        },
        { 
          title: 'Music Player (ମ୍ୟୁଜିକ୍ ପ୍ଲେୟାର୍)', 
          icon: <Music className="w-5 h-5 text-purple-500" />,
          items: [
            'Equalizer: Bass ଏବଂ Treble କୁ ନିଜ ଇଚ୍ଛା ଅନୁସାରେ ବଦଳାନ୍ତୁ।',
            'MP4 to MP3 Converter: ଭିଡିଓକୁ ଏକ କ୍ଲିକ୍ରେ ଅଡିଓରେ ବଦଳାନ୍ତୁ।',
            'Sleep Timer: ସେଟ୍ କରାଯାଇଥିବା ସମୟରେ ଆପେ ଆପେ ବନ୍ଦ ହେବ।',
            'Lyrics Support: ଅନଲାଇନ୍ରେ ଗୀତର ଲିରିକ୍ସ ଖୋଜି ଦେଖନ୍ତୁ।'
          ] 
        },
        { 
          title: 'Downloader & Files (ଡାଉନଲୋଡର୍)', 
          icon: <Download className="w-5 h-5 text-emerald-500" />,
          items: [
            'Video Downloader: ଫେସବୁକ୍, ଇନଷ୍ଟାଗ୍ରାମରୁ ଭିଡିଓ ଡାଉନଲୋଡ୍ କରନ୍ତୁ।',
            'Private Folder: ବ୍ୟକ୍ତିଗତ ଭିଡିଓକୁ ପାସୱାର୍ଡ ଦେଇ ଲୁଚାଇ ରଖନ୍ତୁ।',
            'File Manager: ସବୁ ମିଡ଼ିଆ ଫାଇଲ୍କୁ ଆପେ ଆପେ ସଜାଇ ରଖେ।'
          ] 
        }
      ],
      settings: [
        { name: 'Theme', icon: <Sun className="w-4 h-4" />, function: 'ବ୍ରାଉଜର୍ର ରଙ୍ଗ ଏବଂ ଲୁକ୍ ବଦଳାଇବା ପାଇଁ।' },
        { name: 'Subtitle', icon: <Type className="w-4 h-4" />, function: 'ଅନଲାଇନ୍ରୁ ସବ୍ଟାଇଟଲ୍ ଡାଉନଲୋଡ୍ କିମ୍ବା ସେଟ୍ କରିବା ପାଇଁ।' },
        { name: 'Screenshot', icon: <Smartphone className="w-4 h-4" />, function: 'ଭିଡିଓ ଚାଲୁଥିବା ବେଳେ ଫଟୋ ଉଠାଇବା ପାଇଁ।' },
        { name: 'Auto-play', icon: <Play className="w-4 h-4" />, function: 'ଗୋଟିଏ ଭିଡିଓ ପରେ ଆଉ ଏକ ଭିଡିଓ ଆପେ ଆପେ ଚାଲିବା ପାଇଁ।' },
        { name: 'Decoder', icon: <Settings className="w-4 h-4" />, function: 'Hardware/Software ଡିକୋଡର୍ ବଦଳାଇ ଭିଡିଓକୁ ସ୍ମୁଥ୍ କରିବା ପାଇଁ।'}
      ]
    },
    { 
      id: 'soul', 
      name: 'Soul Browser', 
      author: 'SoulSoft', 
      type: 'Browser', 
      icon: 'https://picsum.photos/64/64?random=21',
      description: 'Soul Browser ର ସେଟିଂସ ଏତେ ଅଧିକ ଯେ ଆପଣ ଏହାକୁ ସମ୍ପୂର୍ଣ୍ଣ ଭାବେ ନିଜ ଇଚ୍ଛା ଅନୁସାରେ ବଦଳାଇ ପାରିବେ।',
      features: [
        { 
          title: 'Layout & Menu (ଡିଜାଇନ୍ ସେଟିଂ)', 
          icon: <Layout className="w-5 h-5 text-blue-500" />,
          items: [
            'Menu Editing: ବଟନ୍ଗୁଡ଼ିକୁ କାଢ଼ି ପାରିବେ କିମ୍ବା ନୂଆ ବଟନ୍ ଯୋଡ଼ି ପାରିବେ।',
            'Layout Editing: ସର୍ଚ୍ଚ ବାର୍ (Search Bar) କୁ ଉପରେ କିମ୍ବା ତଳେ ରଖନ୍ତୁ।',
            'Floating Button: ସ୍କ୍ରିନ୍ ଉପରେ ଏକ ଭାସମାନ ବଟନ୍ ରଖିପାରିବେ।'
          ] 
        },
        { 
          title: 'Media Settings (ମିଡ଼ିଆ କାମ)', 
          icon: <Video className="w-5 h-5 text-orange-500" />,
          items: [
            'Video Downloader: ଯେକୌଣସି ୱେବସାଇଟ୍ରୁ ଭିଡିଓ ଡାଉନଲୋଡ୍ କରନ୍ତୁ।',
            'Video Player: ଭିଡିଓ ସ୍ପିଡ୍ ବଢ଼ାନ୍ତୁ ଏବଂ ଟିଭିକୁ କାଷ୍ଟ (TV Cast) କରନ୍ତୁ।',
            'Save All Images: ପେଜ୍ର ସବୁ ଫଟୋକୁ ଏକାଥରେ ଡାଉନଲୋଡ୍ କରନ୍ତୁ।'
          ] 
        },
        { 
          title: 'Ad Block & Privacy (ସୁରକ୍ଷା ସେଟିଂ)', 
          icon: <Shield className="w-5 h-5 text-emerald-500" />,
          items: [
            'Ad Blocker: ଖରାପ ବିଜ୍ଞାପନକୁ ବ୍ଲକ୍ କରେ।',
            'Keyboard Security: ପାସୱାର୍ଡ ଟାଇପ୍ ପାଇଁ ସୁରକ୍ଷିତ କୀବୋର୍ଡ।',
            'App Lock: ପିନ୍ (PIN) କିମ୍ବା ଫିଙ୍ଗରପ୍ରିଣ୍ଟ୍ ଲକ୍ ସେଟ୍ କରନ୍ତୁ।'
          ] 
        },
        { 
          title: 'Content Settings (ପଢ଼ିବା ସେଟିଂ)', 
          icon: <Type className="w-5 h-5 text-indigo-500" />,
          items: [
            'Text to Speech (TTS): ୱେବସାଇଟ୍ର ଲେଖାକୁ ପଢ଼ି ଶୁଣାଇବ।',
            'Translation: ପେଜ୍କୁ ଆପେ ଆପେ ଅନ୍ୟ ଭାଷାରେ ଅନୁବାଦ କରେ।',
            'Clean Mode: ଅଦରକାରୀ ଜିନିଷ କାଢ଼ି କେବଳ ମୁଖ୍ୟ ବିଷୟ ଦେଖାଏ।'
          ] 
        }
      ],
      settings: [
        { name: 'Gesture', icon: <MousePointer2 className="w-4 h-4" />, function: 'Swipe Gestures (Back, Tab switch) ପାଇଁ।' },
        { name: 'Sites', icon: <Globe className="w-4 h-4" />, function: 'Open link with app ଅନ୍ କରିବା ପାଇଁ।' },
        { name: 'Ad Block', icon: <Shield className="w-4 h-4" />, function: 'ନିର୍ଦ୍ଦିଷ୍ଟ ଜାଗାକୁ ବ୍ଲକ୍ (Block Area) କରିବା ପାଇଁ।' }
      ]
    }
  ];

  const filteredApps = installedApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white flex items-center">
            <AppWindow className="w-8 h-8 mr-3 text-blue-500" />
            My Apps
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Manage your installed applications and their settings.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps..." 
            className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-200 focus:border-blue-500 outline-none transition-all w-full md:w-64"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredApps.map((app) => (
            <motion.div 
              key={app.id}
              whileHover={{ y: -5 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-blue-500/50 transition-all group cursor-pointer"
              onClick={() => setSelectedApp(app)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <img src={app.icon} alt={app.name} className="w-14 h-14 rounded-2xl shadow-lg" />
                <div>
                  <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{app.name}</h3>
                  <p className="text-xs text-zinc-500">{app.type}</p>
                </div>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">{app.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Installed</span>
                <div className="flex space-x-2">
                  <button className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors">
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors">
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* App Details Sidebar/Modal Overlay */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl h-full bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-6 md:p-8 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={selectedApp.icon} alt={selectedApp.name} className="w-16 h-16 rounded-2xl shadow-xl" />
                  <div>
                    <h2 className="text-2xl font-black text-white">{selectedApp.name}</h2>
                    <p className="text-zinc-500 text-sm">{selectedApp.author} • {selectedApp.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <div className="space-y-10">
                  {/* Features */}
                  <section>
                    <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Features & Options</h3>
                    <div className="space-y-6">
                      {selectedApp.features.map((feature: any, idx: number) => (
                        <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-blue-600/10 rounded-lg">
                              {feature.icon}
                            </div>
                            <h4 className="font-black text-white">{feature.title}</h4>
                          </div>
                          <ul className="space-y-3">
                            {feature.items.map((item: string, i: number) => (
                              <li key={i} className="flex items-start space-x-3 text-sm text-zinc-400">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Settings */}
                  <section>
                    <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">App Settings</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedApp.settings.map((setting: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all group">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-zinc-900 rounded-xl text-zinc-400 group-hover:text-blue-400 transition-colors">
                              {setting.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-zinc-200 text-sm">{setting.name}</h4>
                              <p className="text-xs text-zinc-500">{setting.function}</p>
                            </div>
                          </div>
                          <button className="text-xs font-black text-blue-500 hover:text-blue-400 uppercase tracking-wider">Configure</button>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Privacy Tip */}
                  {selectedApp.id === 'playit' && (
                    <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-start space-x-4">
                      <Lock className="w-6 h-6 text-orange-500 shrink-0" />
                      <div>
                        <h4 className="font-bold text-orange-500 mb-1">ପ୍ରାଇଭେସି ଟିପ୍ସ</h4>
                        <p className="text-sm text-zinc-400">ଯଦି ଆପଣ କୌଣସି ଭିଡିଓକୁ ସୁରକ୍ଷିତ ରଖିବାକୁ ଚାହାଁନ୍ତି, ତେବେ "Me" &gt; "Private Folder" କୁ ଯାଇ ସେଟ୍ ଅପ୍ କରନ୍ତୁ।</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-6 md:p-8 border-t border-zinc-800 bg-zinc-900/50 flex items-center space-x-4">
                <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Launch Application</span>
                </button>
                <button className="p-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-2xl transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppsView;
