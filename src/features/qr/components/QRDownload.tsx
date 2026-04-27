import React from 'react';
import { Download, FileImage, FileCode } from 'lucide-react';

interface QRDownloadProps {
  onDownload: (extension: 'png' | 'svg') => void;
}

export const QRDownload: React.FC<QRDownloadProps> = ({ onDownload }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onDownload('png')}
        className="group flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all active:scale-95"
      >
        <FileImage size={14} className="text-indigo-500 group-hover:scale-110 transition-transform" />
        PNG
      </button>
      <button
        onClick={() => onDownload('svg')}
        className="group flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
      >
        <FileCode size={14} className="group-hover:scale-110 transition-transform" />
        SVG
        <Download size={12} className="ml-1 opacity-50" />
      </button>
    </div>
  );
};
