'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Client-side authentication routing checks
    const registered = storage.isRegistered();
    if (registered) {
      router.replace('/login');
    } else {
      router.replace('/register');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Loading Rings */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-16 w-16 animate-ping rounded-full border-2 border-indigo-500/20 opacity-75" />
          <div className="absolute h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500" />
          <div className="h-6 w-6 rounded-full bg-indigo-600 shadow-md shadow-indigo-500/50" />
        </div>
        <h1 className="text-xl font-bold tracking-wider text-zinc-300 animate-pulse">
          AURA
        </h1>
        <p className="text-xs text-zinc-500 uppercase tracking-widest">
          Personal Wellness Core
        </p>
      </div>
    </div>
  );
}
