'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Minus, Users, Play } from 'lucide-react';

export default function LogModal({ isOpen, onClose, onSave, initialLog }) {
  const [count, setCount] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partner, setPartner] = useState(false);
  const [porn, setPorn] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialLog) {
        // We are editing an existing log
        const d = new Date(initialLog.timestamp);
        setDate(d.toISOString().split('T')[0]);
        setTime(d.toTimeString().split(' ')[0].substring(0, 5));
        setCount(initialLog.count || 1);
        setPartner(!!initialLog.partner);
        setPorn(!!initialLog.porn);
        setNotes(initialLog.notes || '');
      } else {
        // Default values for new log
        const now = new Date();
        setDate(now.toISOString().split('T')[0]);
        setTime(now.toTimeString().split(' ')[0].substring(0, 5));
        setCount(1);
        setPartner(false);
        setPorn(false);
        setNotes('');
      }
    }
  }, [isOpen, initialLog]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !time) return alert('Please enter a valid date and time.');

    // Combine date and time to ISO string
    const timestamp = new Date(`${date}T${time}`).toISOString();
    
    onSave({
      id: initialLog?.id,
      timestamp,
      count,
      partner,
      porn,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      {/* Modal Card */}
      <div 
        className="w-full max-h-[90vh] overflow-y-auto sm:max-w-md rounded-t-2xl sm:rounded-2xl glass-panel border border-card-border bg-card-bg shadow-2xl p-6 transition-all duration-300 transform translate-y-0 pb-10 sm:pb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {initialLog ? 'Edit Wellness Log' : 'Add Tracking Entry'}
          </h2>
          <button 
            onClick={onClose} 
            className="rounded-full p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Frequency Counter */}
          <div className="flex flex-col items-center justify-center py-4 bg-background border border-card-border rounded-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Frequency Count
            </span>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setCount(Math.max(1, count - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-card-border text-foreground active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="text-4xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 w-12 text-center">
                {count}
              </span>
              <button
                type="button"
                onClick={() => setCount(count + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-card-border text-foreground active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Date & Time Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 text-foreground"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 text-foreground"
                required
              />
            </div>
          </div>

          {/* Context Options */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              Logging Context
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Partner Toggle */}
              <button
                type="button"
                onClick={() => setPartner(!partner)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  partner
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-card-border bg-card-bg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 text-foreground/80'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>With Partner</span>
              </button>

              {/* Porn Toggle */}
              <button
                type="button"
                onClick={() => setPorn(!porn)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  porn
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'border-card-border bg-card-bg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 text-foreground/80'
                }`}
              >
                <Play className="h-4 w-4" />
                <span>With Porn</span>
              </button>
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Personal Notes / Triggers (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Felt stressed after work, late night boredom..."
              rows={3}
              className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 text-foreground placeholder-zinc-400 dark:placeholder-zinc-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-background border border-card-border px-4 py-3 text-sm font-bold text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 text-sm font-bold shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              {initialLog ? 'Update Entry' : 'Log Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
