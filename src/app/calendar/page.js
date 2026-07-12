'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Trash2, Plus, Clock, Users, Play, PenTool, CheckCircle, ShieldAlert
} from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import LogModal from '@/components/LogModal';
import { storage } from '@/lib/storage';

export default function CalendarPage() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedLog, setSelectedLog] = useState(null);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!storage.isRegistered()) {
      router.replace('/register');
      return;
    }

    // Session lock check
    if (typeof window !== 'undefined' && sessionStorage.getItem('aura_unlocked') !== 'true') {
      router.replace('/login');
      return;
    }

    setUser(storage.getUserProfile());
    loadLogs();
  }, [router]);

  const loadLogs = () => {
    setLogs(storage.getLogs());
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Helper calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDayIndex }, (_, i) => i);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to check if a specific calendar date has logs
  const getLogsForDate = (dayNum) => {
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return (
        logDate.getDate() === dayNum &&
        logDate.getMonth() === month &&
        logDate.getFullYear() === year
      );
    });
  };

  const handleDeleteLog = (logId) => {
    if (confirm('Are you sure you want to delete this log entry?')) {
      storage.deleteLog(logId);
      loadLogs();
    }
  };

  const handleSaveLog = (logEntry) => {
    if (logEntry.id) {
      storage.updateLog(logEntry.id, logEntry);
    } else {
      storage.addLog(logEntry);
    }
    loadLogs();
    setSelectedLog(null);
  };

  const handleEditLog = (log) => {
    setSelectedLog(log);
    setIsLogOpen(true);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground flex flex-col">
      <Header title="Streak Calendar" />
 
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
        {/* Calendar Card Container */}
        <section className="rounded-2xl border border-card-border bg-card-bg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground tracking-tight flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
              <span>{monthNames[month]} {year}</span>
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-card-border bg-card-bg text-zinc-500 hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-card-border bg-card-bg text-zinc-500 hover:text-foreground transition-colors"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
 
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
 
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-2.5 text-center text-sm font-semibold">
            {/* Blanks */}
            {blanksArray.map(blank => (
              <div key={`blank-${blank}`} className="h-9 w-9" />
            ))}
 
            {/* Day numbers */}
            {daysArray.map(day => {
              const dateLogs = getLogsForDate(day);
              const hasLogs = dateLogs.length > 0;
              const totalCountForDay = dateLogs.reduce((sum, log) => sum + log.count, 0);
 
              // Check if today
              const todayObj = new Date();
              const isToday = todayObj.getDate() === day && todayObj.getMonth() === month && todayObj.getFullYear() === year;
 
              return (
                <div 
                  key={`day-${day}`} 
                  className="relative flex items-center justify-center h-9 w-9 mx-auto"
                >
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full transition-all ${
                      hasLogs
                        ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40'
                        : isToday
                          ? 'border border-indigo-500 text-indigo-600 dark:text-indigo-400'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/30'
                    }`}
                  >
                    <span>{day}</span>
                  </div>
 
                  {/* Indicator count bubble */}
                  {hasLogs && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-extrabold text-white">
                      {totalCountForDay}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
 
        {/* Entries Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Recent Log Entries
          </h3>
          <button
            onClick={() => {
              setSelectedLog(null);
              setIsLogOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Log</span>
          </button>
        </div>
 
        {/* History List */}
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 border border-dashed border-card-border rounded-2xl text-zinc-500">
              <CalendarIcon className="h-8 w-8 mb-2 opacity-40 text-zinc-500 dark:text-zinc-400" />
              <p className="text-xs font-semibold">No entries recorded yet.</p>
              <p className="text-[10px] mt-0.5">Toggle logs to build your wellness consistency.</p>
            </div>
          ) : (
            logs.map(log => {
              const logDate = new Date(log.timestamp);
              const formattedDate = logDate.toLocaleDateString(undefined, { 
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
              });
              const formattedTime = logDate.toLocaleTimeString(undefined, {
                hour: '2-digit', minute: '2-digit'
              });
 
              return (
                <div 
                  key={log.id}
                  className="rounded-xl border border-card-border bg-card-bg/40 p-4 flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-foreground">
                        {formattedDate}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold mt-0.5">
                        <Clock className="h-3 w-3" />
                        <span>{formattedTime}</span>
                        <span className="mx-1">•</span>
                        <span>Frequency: {log.count}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditLog(log)}
                        className="p-1.5 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
 
                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {log.partner && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold uppercase tracking-wide">
                        <Users className="h-2.5 w-2.5" />
                        <span>Partner</span>
                      </span>
                    )}
                    {log.porn && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[9px] font-extrabold uppercase tracking-wide">
                        <Play className="h-2.5 w-2.5" />
                        <span>Pornography</span>
                      </span>
                    )}
                    {!log.partner && !log.porn && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[9px] font-extrabold uppercase tracking-wide">
                        <span>Solo Clean</span>
                      </span>
                    )}
                  </div>
 
                  {/* Notes */}
                  {log.notes && (
                    <div className="flex items-start gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 italic bg-card-bg/30 p-2 rounded-lg border border-card-border/40">
                      <PenTool className="h-3 w-3 mt-0.5 text-zinc-500 shrink-0" />
                      <span>"{log.notes}"</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
 
      <LogModal
        isOpen={isLogOpen}
        onClose={() => {
          setIsLogOpen(false);
          setSelectedLog(null);
        }}
        onSave={handleSaveLog}
        initialLog={selectedLog}
      />
 
      <BottomNav />
    </div>
  );
}
