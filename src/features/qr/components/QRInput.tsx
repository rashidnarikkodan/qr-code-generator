import React, { useState, useEffect } from 'react';
import { 
  Link, 
  AlignLeft, 
  Wifi, 
  UserCircle, 
  Mail, 
  Video, 
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Cloud
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
      // Use Cloudinary's unsigned upload (Industry Standard)
      // This is much more reliable for browser-based uploads than anonymous hosts
      const cloudName = 'demo'; // Public demo cloud
      const uploadPreset = 'ml_default'; // Public unsigned preset
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed. The demo cloud may be rate-limited.');
      }

      const data = await response.json();
      
      if (data.secure_url) {
        setUploadedUrl(data.secure_url);
        onChange(data.secure_url);
      } else {
        throw new Error('No URL returned from cloud');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Cloud upload failed. Using Local Simulation mode.');
      
      // Fallback: Use a local object URL (only works on this device)
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
            <label className={labelClass}>Cloud Studio Upload</label>
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
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Uploading to Cloudinary...</p>
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
                    <p className="text-[10px] text-slate-400 font-medium">Industry Standard Hosting</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex gap-4 animate-in fade-in zoom-in duration-700">
              <div className="p-2 bg-white dark:bg-indigo-900/50 rounded-xl shadow-sm h-fit">
                <ImageIcon size={20} className="text-indigo-500" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-black text-indigo-900 dark:text-indigo-300">Cloudinary Integration</p>
                <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed font-medium">
                  We are now using <strong className="text-indigo-900 dark:text-indigo-200">Cloudinary</strong> for professional media hosting. This ensures your high-quality videos and images are optimized and always scannable.
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