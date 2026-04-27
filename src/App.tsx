import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { MediaViewer } from './pages/MediaViewer/MediaViewer';
import { ThemeToggle } from './components/ui/ThemeToggle';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <BrowserRouter>
      <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 relative">
        <div className="fixed top-8 right-8 z-50">
          <ThemeToggle theme={theme} toggle={toggleTheme} />
        </div>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/view" element={<MediaViewer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;