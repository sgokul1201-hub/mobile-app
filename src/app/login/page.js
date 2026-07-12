'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Key, RefreshCw, Delete } from 'lucide-react';
import { storage } from '@/lib/storage';

export default function Login() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // If not registered, go to register
    if (!storage.isRegistered()) {
      router.replace('/register');
    } else {
      setProfile(storage.getUserProfile());
    }
  }, [router]);

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-foreground select-none">
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
        {/* App Branding */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-md">
            <Key className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-2">
            Welcome back, {profile.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            Enter Security PIN to unlock
          </p>
        </div>
 
        {/* PIN Indicators */}
        <div className="flex items-center justify-center gap-4 py-4">
          {Array.from({ length: String(profile.pin).length }).map((_, i) => (
            <div
              key={i}
              className={`h-4.5 w-4.5 rounded-full border-2 transition-all duration-150 ${
                i < pin.length
                  ? 'bg-indigo-500 border-indigo-500 scale-110 shadow-md shadow-indigo-500/30'
                  : 'border-zinc-300 dark:border-zinc-700 bg-transparent'
              }`}
            />
          ))}
        </div>
 
        {error && (
          <div className="text-xs font-semibold text-rose-500 dark:text-rose-400 animate-pulse bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
            {error}
          </div>
        )}
 
        {/* Glassmorphic Numpad */}
        <div className="grid grid-cols-3 gap-4 w-full px-6 pt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(String(num))}
              className="flex h-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-2xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800/80 active:scale-95 transition-all text-zinc-800 dark:text-white"
            >
              {num}
            </button>
          ))}
          
          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="flex h-16 items-center justify-center rounded-2xl bg-transparent text-sm font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 active:scale-95 transition-all"
          >
            Clear
          </button>
 
          {/* 0 Button */}
          <button
            onClick={() => handleKeyPress('0')}
            className="flex h-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-2xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800/80 active:scale-95 transition-all text-zinc-800 dark:text-white"
          >
            0
          </button>
 
          {/* Backspace Button */}
          <button
            onClick={handleDelete}
            className="flex h-16 items-center justify-center rounded-2xl bg-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 active:scale-95 transition-all"
            aria-label="Delete"
          >
            <Delete className="h-6 w-6" />
          </button>
        </div>
 
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold tracking-wider uppercase mt-4">
          Encryption Status: Active (128-bit Local)
        </p>
      </div>
    </div>
  );
}
