import React from 'react';
import type { QRConfig } from '../types';
import { 
  Palette, 
  Maximize, 
  Image as ImageIcon, 
  Settings2,
  ShieldCheck,
  Circle
} from 'lucide-react';

interface QRControlsProps {
  config: QRConfig;
  onChange: (newConfig: Partial<QRConfig>) => void;
}

export const QRControls: React.FC<QRControlsProps> = ({ config, onChange }) => {
  const sectionClass = "p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-5 transition-all hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none";
  const labelClass = "text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2";
  const selectClass = "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-100";
  const inputClass = "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-100";

  return (
    <div className="space-y-8">
      {/* Format Settings */}
      <div className={sectionClass}>
        <label className={labelClass}>
          <Maximize size={14} className="text-indigo-500" />
          Blueprint
        </label>
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold ml-1">SCALE</span>
            <input
              type="number"
              value={config.width}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 300;
                onChange({ width: val, height: val });
              }}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold ml-1">ENGINE</span>
            <select
              value={config.type || 'svg'}
              onChange={(e) => onChange({ type: e.target.value as 'svg' | 'canvas' })}
              className={selectClass}
            >
              <option value="svg">SVG</option>
              <option value="canvas">Canvas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Palette Settings */}
      <div className={sectionClass}>
        <label className={labelClass}>
          <Palette size={14} className="text-pink-500" />
          Palette
        </label>
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold ml-1">DOTS</span>
            <div className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
              <input
                type="color"
                value={config.color}
                onChange={(e) => onChange({ color: e.target.value })}
                className="h-8 w-12 rounded-lg cursor-pointer border-none bg-transparent"
              />
              <span className="text-xs font-mono font-bold dark:text-slate-300">{config.color}</span>
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold ml-1">BACKDROP</span>
            <div className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className="h-8 w-12 rounded-lg cursor-pointer border-none bg-transparent"
              />
              <span className="text-xs font-mono font-bold dark:text-slate-300">{config.backgroundColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Geometry Settings */}
      <div className={sectionClass}>
        <label className={labelClass}>
          <Settings2 size={14} className="text-orange-500" />
          Geometry
        </label>
        <div className="space-y-5">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold ml-1">PATTERN</span>
            <select
              value={config.dotsType || 'square'}
              onChange={(e) => onChange({ dotsType: e.target.value as any })}
              className={selectClass}
            >
              <option value="square">Square</option>
              <option value="rounded">Rounded</option>
              <option value="dots">Dots</option>
              <option value="classy">Classy</option>
              <option value="classy-rounded">Classy Rounded</option>
              <option value="extra-rounded">Extra Rounded</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-bold ml-1">CORNERS</span>
              <select
                value={config.cornerSquareType || 'extra-rounded'}
                onChange={(e) => onChange({ cornerSquareType: e.target.value as any })}
                className={selectClass}
              >
                <option value="square">Square</option>
                <option value="dot">Dot</option>
                <option value="rounded">Rounded</option>
                <option value="extra-rounded">Extra Rounded</option>
              </select>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-bold ml-1">EYES</span>
              <select
                value={config.cornerDotType || 'dot'}
                onChange={(e) => onChange({ cornerDotType: e.target.value as any })}
                className={selectClass}
              >
                <option value="square">Square</option>
                <option value="dot">Dot</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Settings */}
      <div className={sectionClass}>
        <label className={labelClass}>
          <ImageIcon size={14} className="text-teal-500" />
          Insignia
        </label>
        <div className="flex items-center gap-4">
          <label className="flex-1">
            <div className="relative group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      onChange({ logo: event.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl group-hover:border-indigo-400 dark:group-hover:border-indigo-500 transition-all duration-300">
                <ImageIcon size={18} className="text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all" />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Upload Logo</span>
              </div>
            </div>
          </label>
          {config.logo && (
            <button
              onClick={() => onChange({ logo: undefined })}
              className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
              title="Remove Insignia"
            >
              <Circle size={24} className="fill-current opacity-20" />
            </button>
          )}
        </div>
      </div>

      {/* Safety Settings */}
      <div className={sectionClass}>
        <label className={labelClass}>
          <ShieldCheck size={14} className="text-purple-500" />
          Recovery
        </label>
        <div className="space-y-2">
          <span className="text-[10px] text-slate-400 font-bold ml-1">ERROR CORRECTION</span>
          <select
            value={config.errorCorrectionLevel}
            onChange={(e) => onChange({ errorCorrectionLevel: e.target.value as any })}
            className={selectClass}
          >
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
