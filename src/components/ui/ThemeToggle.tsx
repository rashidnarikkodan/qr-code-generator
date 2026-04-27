import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-indigo-100/50 dark:shadow-none border border-white/50 dark:border-slate-700 hover:scale-110 transition-all active:scale-95 group"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-slate-700 group-hover:text-indigo-600 transition-colors" />
      ) : (
        <Sun size={20} className="text-amber-400 group-hover:text-amber-300 transition-colors" />
      )}
    </button>
  );
};
