'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Key, Delete, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { storage } from '@/lib/storage';

export default function Login() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState('dark');
  const router = useRouter();

  useEffect(() => {
    // Read theme setting and apply to HTML root on mount
    const settings = storage.getSettings();
    const currentTheme = settings.theme || 'dark';
    setTheme(currentTheme);
    if (currentTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    // If not registered, go to register
    if (!storage.isRegistered()) {
      router.replace('/register');
    } else {
      setProfile(storage.getUserProfile());
    }
  }, [router]);

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

  const handleKeyPress = (num) => {
    setError('');
    if (pin.length < 6) {
      setPin(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  // Auto-submit when PIN length reaches user's stored PIN length
  useEffect(() => {
    if (profile && pin.length === String(profile.pin).length) {
      const isValid = storage.verifyPin(pin);
      if (isValid) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('aura_unlocked', 'true');
        }
        router.push('/dashboard');
      } else {
        setError('Incorrect security PIN. Please try again.');
        // Shake feedback or clear pin
        setTimeout(() => setPin(''), 500);
      }
    }
  }, [pin, profile, router]);

  if (!profile) return null;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 text-foreground select-none">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
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

      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
        {/* App Branding */}
        <div className="flex flex-col items-center gap-2">
          <motion.div 
            animate={{ scale: [1, 1.08, 1], y: [0, -2, 0], rotate: [0, 5, -5, 0], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-md"
          >
            <Key className="h-6 w-6" />
          </motion.div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-2">
            Welcome back, {profile.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-semibold">
            Enter Security PIN to unlock
          </p>
        </div>

        {/* Glass Capsule PIN Indicators Container */}
        <motion.div 
          animate={{
            borderColor: pin.length > 0 ? "var(--primary)" : "var(--card-border)",
            boxShadow: pin.length > 0 
              ? "0 4px 15px rgba(99, 102, 241, 0.15)" 
              : "0 2px 5px rgba(0, 0, 0, 0.02)"
          }}
          className="flex items-center justify-center gap-4 px-6 py-3 rounded-2xl bg-card-bg backdrop-blur-md border border-card-border shadow-inner"
        >
          {Array.from({ length: String(profile.pin).length }).map((_, i) => (
            <motion.div
              key={i}
              animate={i < pin.length 
                ? { scale: 1.25, backgroundColor: "var(--primary)", borderColor: "var(--primary)", boxShadow: "0 0 10px rgba(99, 102, 241, 0.6)" } 
                : { scale: 1, backgroundColor: "rgba(120, 120, 120, 0.15)", borderColor: "rgba(120, 120, 120, 0.4)", boxShadow: "none" }
              }
              transition={{ type: "spring", stiffness: 450, damping: 17 }}
              className="h-3.5 w-3.5 rounded-full border-2 bg-transparent"
            />
          ))}
        </motion.div>

        {error && (
          <div className="text-xs font-semibold text-rose-500 dark:text-rose-400 animate-pulse bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
            {error}
          </div>
        )}

        {/* Glassmorphic Numpad (Restored rounded-2xl layout with iPhone glass finish) */}
        <div className="grid grid-cols-3 gap-4 w-full px-6 pt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              onClick={() => handleKeyPress(String(num))}
              animate={{
                boxShadow: [
                  "0 2px 4px -1px rgba(99, 102, 241, 0.01), 0 1px 2px -1px rgba(99, 102, 241, 0.01)",
                  "0 4px 10px -2px rgba(99, 102, 241, 0.06), 0 2px 4px -2px rgba(99, 102, 241, 0.01)",
                  "0 2px 4px -1px rgba(99, 102, 241, 0.01), 0 1px 2px -1px rgba(99, 102, 241, 0.01)"
                ]
              }}
              transition={{ repeat: Infinity, duration: 2.5 + num * 0.15, ease: "easeInOut" }}
              whileTap={{ scale: 0.94 }}
              className="flex h-16 items-center justify-center rounded-2xl bg-card-bg border border-card-border backdrop-blur-md text-2xl font-bold text-foreground cursor-pointer"
            >
              {num}
            </motion.button>
          ))}
          
          {/* Clear Button */}
          <motion.button
            onClick={handleClear}
            whileTap={{ scale: 0.94 }}
            className="flex h-16 items-center justify-center rounded-2xl bg-transparent text-sm font-bold text-foreground/60 hover:text-foreground cursor-pointer"
          >
            Clear
          </motion.button>

          {/* 0 Button */}
          <motion.button
            onClick={() => handleKeyPress('0')}
            animate={{
              boxShadow: [
                "0 2px 4px -1px rgba(99, 102, 241, 0.01), 0 1px 2px -1px rgba(99, 102, 241, 0.01)",
                "0 4px 10px -2px rgba(99, 102, 241, 0.06), 0 2px 4px -2px rgba(99, 102, 241, 0.01)",
                "0 2px 4px -1px rgba(99, 102, 241, 0.01), 0 1px 2px -1px rgba(99, 102, 241, 0.01)"
              ]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            whileTap={{ scale: 0.94 }}
            className="flex h-16 items-center justify-center rounded-2xl bg-card-bg border border-card-border backdrop-blur-md text-2xl font-bold text-foreground cursor-pointer"
          >
            0
          </motion.button>

          {/* Backspace Button */}
          <motion.button
            onClick={handleDelete}
            whileTap={{ scale: 0.94 }}
            className="flex h-16 items-center justify-center rounded-2xl bg-transparent text-foreground/60 hover:text-foreground cursor-pointer"
            aria-label="Delete"
          >
            <Delete className="h-5 w-5" />
          </motion.button>
        </div>

        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold tracking-wider uppercase mt-4">
          Encryption Status: Active (128-bit Local)
        </p>
      </div>
    </div>
  );
}
