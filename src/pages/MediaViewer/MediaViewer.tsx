import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { QrCode, ArrowLeft, Download, ExternalLink, Sparkles } from 'lucide-react';

export const MediaViewer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mediaUrl = searchParams.get('media');

  if (!mediaUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <div className="text-center space-y-6">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl shadow-xl inline-block ring-1 ring-slate-100 dark:ring-slate-700">
             <QrCode size={48} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-black">No Media Found</h1>
          <p className="text-slate-500 max-w-xs mx-auto">This link seems to be invalid or has expired.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
            <ArrowLeft size={16} /> Return to Studio
          </Link>
        </div>
      </div>
    );
  }

  const isVideo = mediaUrl.match(/\.(mp4|webm|ogg|mov|m4v)$/i) || mediaUrl.includes('/video/upload/');
  const isImage = mediaUrl.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i) || mediaUrl.includes('/image/upload/');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 selection:bg-indigo-100 dark:selection:bg-indigo-900">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-[40%] h-[40%] rounded-full bg-indigo-200/20 dark:bg-indigo-900/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] rounded-full bg-teal-200/20 dark:bg-teal-900/10 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        <header className="flex items-center justify-between mb-8 md:mb-12">
          <Link to="/" className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-white/50 dark:border-slate-700 hover:scale-110 transition-all">
            <QrCode size={24} className="text-indigo-600 dark:text-indigo-400" />
          </Link>
          <div className="px-4 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-200 dark:shadow-none">
            QR Architect Viewer
          </div>
        </header>

        <main className="animate-in fade-in zoom-in duration-700">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-4 md:p-8 rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-slate-800 overflow-hidden group">
            {/* Media Container */}
            <div className="relative aspect-video md:aspect-auto md:min-h-[400px] rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700">
              {isVideo ? (
                <video 
                  src={mediaUrl} 
                  controls 
                  autoPlay
                  className="max-h-[70vh] w-full"
                />
              ) : isImage ? (
                <img 
                  src={mediaUrl} 
                  alt="QR Content" 
                  className="max-h-[70vh] object-contain transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="p-12 text-center space-y-6">
                  <div className="p-6 bg-white dark:bg-slate-700 rounded-full inline-block shadow-inner">
                    <ExternalLink size={48} className="text-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">Document or Unknown File</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">This file format is best viewed by downloading or opening in a new tab.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-center px-2">
              <div className="space-y-1 text-center md:text-left">
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 justify-center md:justify-start">
                  Shared Media
                  <Sparkles size={16} className="text-amber-500 animate-pulse" />
                </h2>
                <p className="text-xs text-slate-400 font-medium">Scanned via QR Architect Studio</p>
              </div>

              <div className="flex gap-3">
                <a 
                  href={mediaUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
                >
                  <ExternalLink size={14} />
                  Original
                </a>
                <a 
                  href={mediaUrl} 
                  download
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-95"
                >
                  <Download size={14} />
                  Download
                </a>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-12 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Powered by QR Architect
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-3xl text-sm font-bold text-slate-600 dark:text-slate-400 transition-all border border-transparent hover:border-indigo-200 dark:hover:border-indigo-900"
          >
            <QrCode size={18} />
            Create Your Own QR Code
          </Link>
        </footer>
      </div>
    </div>
  );
};
