
import React, { useState } from 'react';
import { Shield, Bell, Database, Key, CreditCard, User, Monitor, Smartphone, Globe, Lock, ChevronRight } from 'lucide-react';

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState({
    vaultAuth: false,
    adBlocker: true,
    containerTabs: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 md:space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">System Settings</h2>
          <p className="text-zinc-500 text-sm md:text-base">Configure your Hyper Browser experience and identity.</p>
        </div>

        <section className="space-y-6">
          <h3 className="text-[10px] md:text-xs font-black text-zinc-600 uppercase tracking-widest px-1">Subscription Plan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <PlanCard title="Free" price="$0" features={['Basic AI Search', 'Limited Nodes', 'Ads Enabled']} active />
            <PlanCard title="Pro" price="$19" features={['Pro Thinking AI', 'Unlimited Studio', 'Zero Ads']} />
            <PlanCard title="Enterprise" price="$99" features={['Private Dedicated LLM', 'SSO & Vault', 'Custom APIs']} />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] md:text-xs font-black text-zinc-600 uppercase tracking-widest px-1">Security & Privacy</h3>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl md:rounded-3xl divide-y divide-zinc-800 overflow-hidden">
            <SettingItem 
              icon={<Lock className="w-5 h-5" />} 
              label="Vault Authentication" 
              description="Require biometric or PIN to access API keys." 
              toggle 
              checked={settings.vaultAuth}
              onToggle={() => toggleSetting('vaultAuth')}
            />
            <SettingItem 
              icon={<Shield className="w-5 h-5" />} 
              label="Hyper-AdBlocker" 
              description="Native blockage of trackers and intrusive scripts." 
              toggle 
              checked={settings.adBlocker}
              onToggle={() => toggleSetting('adBlocker')}
            />
            <SettingItem 
              icon={<Globe className="w-5 h-5" />} 
              label="Containerized Tabs" 
              description="Keep browsing history isolated per tab group." 
              toggle 
              checked={settings.containerTabs}
              onToggle={() => toggleSetting('containerTabs')}
            />
            <SettingItem icon={<Key className="w-5 h-5" />} label="API Key Management" />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] md:text-xs font-black text-zinc-600 uppercase tracking-widest px-1">Personalization</h3>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl md:rounded-3xl divide-y divide-zinc-800 overflow-hidden">
            <SettingItem icon={<User className="w-5 h-5" />} label="User Profile" />
            <SettingItem icon={<Monitor className="w-5 h-5" />} label="Theme & Layout" description="Current: Ultra-Dark Glassmorphism" />
            <SettingItem icon={<Smartphone className="w-5 h-5" />} label="Mobile Sync" />
          </div>
        </section>
      </div>
    </div>
  );
};

const PlanCard: React.FC<{ title: string; price: string; features: string[]; active?: boolean }> = ({ title, price, features, active }) => (
  <div className={`p-6 rounded-2xl md:rounded-3xl border transition-all ${active ? 'bg-blue-600/10 border-blue-500/50 shadow-2xl shadow-blue-500/10' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
    <h4 className="text-lg font-black text-white mb-1">{title}</h4>
    <div className="flex items-baseline space-x-1 mb-4">
      <span className="text-2xl font-black text-white">{price}</span>
      <span className="text-xs text-zinc-500">/mo</span>
    </div>
    <ul className="space-y-2 mb-6">
      {features.map((f, i) => (
        <li key={i} className="text-xs text-zinc-400 flex items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
          {f}
        </li>
      ))}
    </ul>
    <button className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${active ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
      {active ? 'Current Plan' : 'Upgrade'}
    </button>
  </div>
);

const SettingItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  description?: string; 
  toggle?: boolean; 
  checked?: boolean;
  onToggle?: () => void;
}> = ({ icon, label, description, toggle, checked, onToggle }) => (
  <div 
    className="p-4 md:p-5 flex items-center justify-between group cursor-pointer hover:bg-zinc-800/30 transition-colors"
    onClick={toggle ? onToggle : undefined}
  >
    <div className="flex items-center space-x-3 md:space-x-4 min-w-0">
      <div className="p-2 md:p-2.5 bg-zinc-800 rounded-xl group-hover:bg-zinc-700 transition-colors text-zinc-400 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-zinc-200 text-sm md:text-base truncate">{label}</h4>
        {description && <p className="text-[10px] md:text-xs text-zinc-500 mt-0.5 line-clamp-1">{description}</p>}
      </div>
    </div>
    {toggle ? (
      <div 
        className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${checked ? 'bg-blue-600' : 'bg-zinc-700'}`}
      >
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${checked ? 'right-1' : 'left-1'}`} />
      </div>
    ) : (
      <div className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0">
        <ChevronRight className="w-4 h-4" />
      </div>
    )}
  </div>
);

export default SettingsView;
