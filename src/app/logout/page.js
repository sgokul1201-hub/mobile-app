'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, LogIn, Lock } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear the active session lock in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('aura_unlocked');
    }
  }, []);

  const handleUnlock = () => {
    router.replace('/login');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground select-none">
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-8">
        {/* Animated Locking Badge */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute h-20 w-20 animate-ping rounded-full border border-indigo-500/10 opacity-75" />
          <div className="absolute h-16 w-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Lock className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        {/* Status Message */}
        <div className="space-y-3">
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Session Locked
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold max-w-xs mx-auto leading-relaxed">
            Your local wellness data has been secured. The temporary session key was cleared.
          </p>
        </div>

        {/* Security Feature Highlights */}
        <div className="w-full bg-card-bg border border-card-border p-4 rounded-xl space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Local Database Offline</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal font-semibold">
            All data remains stored within your device&apos;s secure browser sandbox. No server transfers occurred.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleUnlock}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 font-bold shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all"
        >
          <LogIn className="h-5 w-5" />
          <span>Unlock Dashboard</span>
        </button>
      </div>
    </div>
  );
}
