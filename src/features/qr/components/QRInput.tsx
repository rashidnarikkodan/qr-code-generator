import React, { useState, useEffect } from 'react';
import { 
  Link, 
  AlignLeft, 
  Wifi, 
  UserCircle, 
  Mail, 
  Camera,
  Send,
  Code,
  Play,
  Share2
} from 'lucide-react';
import type { QRConfig } from '../types';

interface QRInputProps {
  config: QRConfig;
  onChange: (data: string) => void;
  onTypeChange: (type: QRConfig['dataType']) => void;
}

export const QRInput: React.FC<QRInputProps> = ({ config, onChange, onTypeChange }) => {
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiType, setWifiType] = useState('WPA');

  const [vCard, setVCard] = useState({
    name: '',
    phone: '',
    email: '',
    org: ''
  });

  const [socialHandle, setSocialHandle] = useState('');
  const [socialPlatform, setSocialPlatform] = useState<'instagram' | 'twitter' | 'github' | 'youtube'>('instagram');

  useEffect(() => {
    if (config.dataType === 'wifi') {
      const wifiString = `WIFI:S:${wifiSsid};T:${wifiType};P:${wifiPassword};;`;
      onChange(wifiString);
    }
  }, [wifiSsid, wifiPassword, wifiType, config.dataType]);

  useEffect(() => {
    if (config.dataType === 'vcard') {
      const vcardString = `BEGIN:VCARD\nVERSION:3.0\nFN:${vCard.name}\nORG:${vCard.org}\nTEL:${vCard.phone}\nEMAIL:${vCard.email}\nEND:VCARD`;
      onChange(vcardString);
    }
  }, [vCard, config.dataType]);

  useEffect(() => {
    if (config.dataType === 'social') {
      const urls = {
        instagram: `https://instagram.com/${socialHandle}`,
        twitter: `https://twitter.com/${socialHandle}`,
        github: `https://github.com/${socialHandle}`,
        youtube: `https://youtube.com/@${socialHandle}`,
      };
      onChange(urls[socialPlatform]);
    }
  }, [socialHandle, socialPlatform, config.dataType]);

  const tabs = [
    { id: 'url', icon: Link, label: 'URL' },
    { id: 'social', icon: Share2, label: 'Social' },
    { id: 'wifi', icon: Wifi, label: 'WiFi' },
    { id: 'vcard', icon: UserCircle, label: 'VCard' },
    { id: 'email', icon: Mail, label: 'Email' },
    { id: 'text', icon: AlignLeft, label: 'Text' },
  ] as const;

  const inputClass = "w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-100 placeholder:text-slate-400";
  const labelClass = "text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block";

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl gap-1.5 ring-1 ring-slate-200/50 dark:ring-slate-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTypeChange(tab.id as any)}
            className={`flex flex-col items-center gap-2 py-3 rounded-xl transition-all duration-300 ${
              config.dataType === tab.id
                ? 'bg-white dark:bg-slate-700 shadow-xl dark:shadow-none text-indigo-600 dark:text-indigo-400 scale-105 ring-1 ring-slate-100 dark:ring-slate-600'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/30'
            }`}
          >
            <tab.icon size={18} strokeWidth={2.5} />
            <span className="text-[8px] font-black uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {config.dataType === 'url' && (
          <div className="space-y-1">
            <label className={labelClass}>Website URL</label>
            <input
              type="url"
              value={config.data}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com"
              className={inputClass}
            />
          </div>
        )}

        {config.dataType === 'social' && (
          <div className="space-y-5">
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'instagram', icon: Camera, label: 'Instagram' },
                { id: 'twitter', icon: Send, label: 'Twitter' },
                { id: 'github', icon: Code, label: 'Github' },
                { id: 'youtube', icon: Play, label: 'Youtube' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSocialPlatform(p.id as any)}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 ${
                    socialPlatform === p.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <p.icon size={20} />
                  <span className="text-[8px] font-black uppercase tracking-tighter">{p.label}</span>
                </button>
              ))}
            </div>
            <div className="space-y-1">
              <label className={labelClass}>{socialPlatform} Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                <input
                  type="text"
                  value={socialHandle}
                  onChange={(e) => setSocialHandle(e.target.value)}
                  placeholder="username"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </div>
          </div>
        )}

        {config.dataType === 'wifi' && (
          <div className="space-y-5">
            <div className="space-y-1">
              <label className={labelClass}>SSID</label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="WiFi Name"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className={labelClass}>Encryption</label>
                <select
                  value={wifiType}
                  onChange={(e) => setWifiType(e.target.value)}
                  className={inputClass}
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                  disabled={wifiType === 'nopass'}
                />
              </div>
            </div>
          </div>
        )}

        {config.dataType === 'vcard' && (
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1 col-span-2">
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                value={vCard.name}
                onChange={(e) => setVCard({ ...vCard, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Phone</label>
              <input
                type="tel"
                value={vCard.phone}
                onChange={(e) => setVCard({ ...vCard, phone: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={vCard.email}
                onChange={(e) => setVCard({ ...vCard, email: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {config.dataType === 'email' && (
          <div className="space-y-1">
            <label className={labelClass}>Recipient</label>
            <input
              type="email"
              placeholder="hello@example.com"
              onChange={(e) => onChange(`mailto:${e.target.value}`)}
              className={inputClass}
            />
          </div>
        )}

        {config.dataType === 'text' && (
          <div className="space-y-1">
            <label className={labelClass}>Plain Text</label>
            <textarea
              rows={5}
              value={config.data}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter your message here..."
              className={inputClass}
            />
          </div>
        )}
      </div>
    </div>
  );
};