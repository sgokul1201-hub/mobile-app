'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, LogOut, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';

export default function Header({ title }) {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Read theme and profile on mount
    const settings = storage.getSettings();
    setTheme(settings.theme || 'dark');
    
    // Apply class to HTML
    if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    const profile = storage.getUserProfile();
    setUser(profile);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    storage.updateSettings({ theme: nextTheme });
    
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleLogout = () => {
    router.push('/logout');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel safe-top border-b border-[var(--card-border)] backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <span className="font-bold text-lg tracking-wider">A</span>
            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            {title || 'AURA'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Secure lock status */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
            <Shield className="h-4 w-4" />
          </div>

          {/* Logout */}
          {user && (
            <button
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              title="Lock Access"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
