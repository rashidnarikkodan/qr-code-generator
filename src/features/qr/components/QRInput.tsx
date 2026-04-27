import React, { useState, useEffect } from 'react';
import { 
  Link, 
  AlignLeft, 
  Wifi, 
  UserCircle, 
  Mail, 
  Video, 
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Cloud,
  Settings
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

  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Advanced Cloud Config
  const [showConfig, setShowConfig] = useState(false);
  const [cloudConfig, setCloudConfig] = useState({
    cloudName: localStorage.getItem('qr_cloud_name') || 'demo',
    uploadPreset: localStorage.getItem('qr_upload_preset') || 'ml_default'
  });

  useEffect(() => {
    localStorage.setItem('qr_cloud_name', cloudConfig.cloudName);
    localStorage.setItem('qr_upload_preset', cloudConfig.uploadPreset);
  }, [cloudConfig]);

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

  const handleMediaUpload = async (file: File) => {
    setUploading(true);
    setUploadedUrl(null);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudConfig.uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudConfig.cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed. The current cloud configuration might be rate-limited.');
      }

      const data = await response.json();
      
      if (data.secure_url) {
        const viewerLink = `${window.location.origin}/view?media=${encodeURIComponent(data.secure_url)}`;
        setUploadedUrl(viewerLink);
        onChange(viewerLink);
      } else {
        throw new Error('No URL returned from cloud');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Cloud upload failed. Using Local Simulation mode.');
      
      const localUrl = URL.createObjectURL(file);
      setUploadedUrl(localUrl);
      onChange(localUrl);
    } finally {
      setUploading(false);
    }
  };

  const tabs = [
    { id: 'url', icon: Link, label: 'URL' },
    { id: 'text', icon: AlignLeft, label: 'Text' },
    { id: 'wifi', icon: Wifi, label: 'WiFi' },
    { id: 'vcard', icon: UserCircle, label: 'VCard' },
    { id: 'email', icon: Mail, label: 'Email' },
    { id: 'media', icon: Video, label: 'Media' },
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
            onClick={() => {
              onTypeChange(tab.id as any);
              setUploadedUrl(null);
              setUploadError(null);
            }}
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

        {config.dataType === 'media' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass}>Cloud Studio Upload</label>
              <button 
                onClick={() => setShowConfig(!showConfig)}
                className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-600 transition-colors"
              >
                <Settings size={12} />
                {showConfig ? 'Hide Config' : 'Custom Cloud'}
              </button>
            </div>

            {showConfig && (
              <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/20 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">Cloud Name</span>
                    <input 
                      type="text" 
                      value={cloudConfig.cloudName}
                      onChange={(e) => setCloudConfig({...cloudConfig, cloudName: e.target.value})}
                      placeholder="demo"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">Preset</span>
                    <input 
                      type="text" 
                      value={cloudConfig.uploadPreset}
                      onChange={(e) => setCloudConfig({...cloudConfig, uploadPreset: e.target.value})}
                      placeholder="ml_default"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  Pro Tip: Create a free Cloudinary account to get your own credentials and bypass demo rate limits.
                </p>
              </div>
            )}

            <div 
              className={`relative border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden ${
                uploading 
                  ? 'border-indigo-300 bg-indigo-50/10' 
                  : uploadedUrl 
                    ? 'border-teal-300 bg-teal-50/10' 
                    : uploadError
                      ? 'border-amber-300 bg-amber-50/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600'
              }`}
            >
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleMediaUpload(file);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={uploading}
              />
              
              {uploading ? (
                <div className="space-y-4">
                  <Loader2 size={40} className="text-indigo-500 animate-spin mx-auto" />
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Uploading to {cloudConfig.cloudName}...</p>
                </div>
              ) : uploadedUrl ? (
                <div className="space-y-4 animate-in zoom-in duration-500">
                  <CheckCircle2 size={40} className="text-teal-500 mx-auto" />
                  <div>
                    <p className="text-sm font-black text-teal-700 dark:text-teal-400">Live & Hosted!</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1 truncate max-w-[200px] mx-auto">{uploadedUrl}</p>
                  </div>
                </div>
              ) : uploadError ? (
                <div className="space-y-4 px-4">
                  <AlertTriangle size={40} className="text-amber-500 mx-auto" />
                  <p className="text-xs font-bold text-amber-700 leading-tight">{uploadError}</p>
                  <p className="text-[10px] text-slate-400">Scan this QR now to test on this device.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full shadow-inner ring-1 ring-slate-100 dark:ring-slate-700">
                    <Cloud size={32} className="text-indigo-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Click to Cloud Upload</p>
                    <p className="text-[10px] text-slate-400 font-medium">Using {cloudConfig.cloudName} storage</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex gap-4 animate-in fade-in zoom-in duration-700">
              <div className="p-2 bg-white dark:bg-indigo-900/50 rounded-xl shadow-sm h-fit">
                <Cloud size={20} className="text-indigo-500" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-black text-indigo-900 dark:text-indigo-300">Production Ready Hosting</p>
                <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed font-medium">
                  We use <strong className="text-indigo-900 dark:text-indigo-200">Cloudinary</strong> for professional hosting. By default, it uses a public demo cloud, but you can add your own for unlimited uploads.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Other types remain unchanged */}
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
      </div>
    </div>
  );
};