'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Trash2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { storage } from '@/lib/storage';

export default function DangerZonePage() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleWipeData = (e) => {
    e.preventDefault();
    setError('');

    if (confirmText.toUpperCase() !== 'WIPE') {
      setError('Please type the confirmation word "WIPE" exactly.');
      return;
    }

    try {
      setSuccess(true);
      setTimeout(() => {
        storage.clearAllData();
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('aura_unlocked');
        }
        router.push('/register');
      }, 1500);
    } catch (err) {
      setError('An error occurred while wiping data.');
      setSuccess(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground flex flex-col select-none">
      <Header title="Danger Zone" />

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
        {/* Back navigation */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCancel}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card-bg border border-card-border text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Critical Actions
            </h2>
            <p className="text-xs text-rose-500 dark:text-rose-400 font-bold uppercase tracking-wider">
              Data Destruction Portal
            </p>
          </div>
        </div>

        {/* Warning Card */}
        <motion.section 
          animate={{
            boxShadow: [
              "0 4px 6px -1px rgba(239, 68, 68, 0.1), 0 2px 4px -1px rgba(239, 68, 68, 0.06)",
              "0 10px 20px -3px rgba(239, 68, 68, 0.25), 0 4px 6px -2px rgba(239, 68, 68, 0.1)",
              "0 4px 6px -1px rgba(239, 68, 68, 0.1), 0 2px 4px -1px rgba(239, 68, 68, 0.06)"
            ]
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 space-y-5"
        >
          <div className="flex items-center gap-3 text-rose-500">
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20"
            >
              <ShieldAlert className="h-5 w-5" />
            </motion.div>
            <h3 className="font-extrabold text-base tracking-tight text-rose-600 dark:text-rose-400">Irreversible Action</h3>
          </div>

          <div className="text-sm leading-relaxed text-foreground font-semibold space-y-3">
            <p>
              Wiping your local storage database will permanently delete:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-foreground/90">
              <li>All historical habit and wellness logs</li>
              <li>Your lockscreen PIN access configurations</li>
              <li>Your diagnostic profiles, preferences, and names</li>
            </ul>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-bold border-l-2 border-rose-500 pl-3">
              This action cannot be undone. Aura has no cloud servers and cannot restore deleted profiles.
            </p>
          </div>
        </motion.section>

        {/* Confirmation Form */}
        <section className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-6 shadow-lg">
          <form onSubmit={handleWipeData} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Type <span className="text-rose-500 font-black">WIPE</span> to confirm deletion
              </label>
              <input
                type="text"
                placeholder="Type WIPE here"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3.5 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-center font-bold tracking-widest text-foreground placeholder-zinc-400 dark:placeholder-zinc-600"
                required
                disabled={success}
              />
            </div>

            {error && (
              <p className="text-xs font-bold text-rose-500 text-center">
                {error}
              </p>
            )}

            {success && (
              <div className="flex flex-col items-center justify-center gap-2 pt-2 text-center text-rose-500">
                <AlertTriangle className="h-6 w-6 animate-pulse" />
                <p className="text-xs font-extrabold uppercase tracking-widest animate-pulse">
                  Wiping database...
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={success}
                className="flex-1 rounded-xl bg-background border border-card-border px-4 py-3.5 text-xs font-bold text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={success}
                className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-rose-600/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Wipe Database</span>
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
