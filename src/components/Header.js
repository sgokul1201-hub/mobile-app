'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, LogOut, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { motion } from 'framer-motion';

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

  const handleLock = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('aura_unlocked');
    }
    router.replace('/login');
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
            <motion.div
              animate={{ y: [0, -1, 0], rotate: [0, 4, -4, 0], opacity: [0.8, 1, 0.8] }}
              whileTap={{ scale: 0.9 }}
              transition={{
                y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                opacity: { repeat: Infinity, duration: 2.8, ease: "easeInOut" },
                scale: { type: "spring", stiffness: 450, damping: 14 }
              }}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.div>
          </button>

          {/* Secure lock status option */}
          <button
            onClick={handleLock}
            className="flex h-10 w-10 items-center justify-center rounded-full text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
            title="Lock Session"
          >
            <motion.div 
              animate={{ scale: [1, 1.05, 1], y: [0, -1.2, 0], rotate: [0, 3, -3, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Shield className="h-4 w-4" />
            </motion.div>
          </button>

          {/* Logout */}
          {user && (
            <button
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              title="Secure Lockscreen"
            >
              <motion.div
                animate={{ y: [0, -1, 0], rotate: [0, 3, -3, 0], opacity: [0.8, 1, 0.8] }}
                whileTap={{ scale: 0.9 }}
                transition={{
                  y: { repeat: Infinity, duration: 3.2, ease: "easeInOut" },
                  rotate: { repeat: Infinity, duration: 3.8, ease: "easeInOut" },
                  opacity: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                  scale: { type: "spring", stiffness: 400, damping: 15 }
                }}
              >
                <LogOut className="h-5 w-5" />
              </motion.div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
