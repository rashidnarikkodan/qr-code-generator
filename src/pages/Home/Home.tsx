import React, { useRef } from 'react';
import {
  QRInput,
  QRPreview,
  QRControls,
  QRDownload,
  useQRCode,
} from '../../features/qr';
import type { QRPreviewHandle } from '../../features/qr/components/QRPreview';
import { Sparkles, QrCode } from 'lucide-react';

export const Home: React.FC = () => {
  const { config, setData, updateConfig } = useQRCode();
  const previewRef = useRef<QRPreviewHandle>(null);

  const handleDownload = (extension: 'png' | 'svg') => {
    previewRef.current?.download(extension);
  };

  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950 transition-colors duration-500 py-12 px-4 selection:bg-indigo-100 dark:selection:bg-indigo-900">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-200/30 dark:bg-indigo-900/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-teal-200/30 dark:bg-teal-900/20 blur-[120px] animate-pulse-slow delay-700" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center animate-in fade-in slide-in-from-top duration-1000">
          <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-slate-800 shadow-2xl rounded-3xl mb-8 ring-1 ring-slate-100 dark:ring-slate-700 animate-float">
            <QrCode size={48} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-6xl font-black tracking-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 dark:from-indigo-400 dark:via-purple-400 dark:to-teal-400 animate-gradient-x">
              QR Architect
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            The professional studio for crafting exquisite, high-performance QR codes.
          </p>
        </header>

        <main className="flex flex-col lg:flex-row gap-10 items-start pb-20">
          {/* Design Studio Section */}
          <section className="flex-1 space-y-8 animate-in fade-in slide-in-from-left duration-1000 delay-200">
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl dark:shadow-none border border-white/50 dark:border-slate-800">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
                  <Sparkles size={24} className="text-amber-500 animate-pulse" />
                  Studio
                </h2>
                <div className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ring-1 ring-indigo-100 dark:ring-indigo-900/50">
                  Live Engine
                </div>
              </div>
              
              <div className="space-y-10">
                <QRInput 
                  config={config} 
                  onChange={setData} 
                  onTypeChange={(type) => updateConfig({ dataType: type, data: '' })} 
                />
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
                <QRControls config={config} onChange={updateConfig} />
              </div>
            </div>
          </section>

          {/* Result Section - Sticky */}
          <section className="w-full lg:w-[450px] lg:sticky lg:top-8 space-y-8 animate-in fade-in slide-in-from-right duration-1000 delay-300">
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl dark:shadow-none border border-white/50 dark:border-slate-800 relative group overflow-hidden">
              {/* Internal Accent Gradients */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Preview</h2>
                  <QRDownload onDownload={handleDownload} />
                </div>
                
                <div className="relative">
                  <QRPreview ref={previewRef} config={config} />
                </div>

                <div className="mt-10 grid grid-cols-2 gap-6">
                  <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30">
                    <p className="text-[10px] font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-[0.2em] mb-2">Resolution</p>
                    <p className="text-lg text-indigo-700 dark:text-indigo-400 font-bold">{config.width}px</p>
                  </div>
                  <div className="p-5 bg-teal-50/50 dark:bg-teal-900/20 rounded-2xl border border-teal-100/50 dark:border-teal-900/30">
                    <p className="text-[10px] font-black text-teal-900 dark:text-teal-300 uppercase tracking-[0.2em] mb-2">Format</p>
                    <p className="text-lg text-teal-700 dark:text-teal-400 font-bold uppercase tracking-tight">{config.type || 'svg'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tip Card */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <QrCode size={100} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-3 flex items-center gap-3 text-amber-400">
                  <Sparkles size={20} />
                  Pro Tip
                </h3>
                <p className="text-indigo-50 text-sm leading-relaxed font-medium opacity-90">
                  Logo in the middle? Use <strong className="text-white underline decoration-amber-400 underline-offset-4">High (H)</strong> recovery for perfect scans.
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-8 mb-12 text-center text-slate-400 dark:text-slate-600 text-sm font-semibold tracking-wide uppercase">
          <p>© 2026 QR Architect <span className="mx-2 opacity-30">•</span> Precision Engineered</p>
        </footer>
      </div>
    </div>
  );
};
