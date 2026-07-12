'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Zap, Calendar, ShieldCheck, Flame, ChevronRight, Plus, 
  CheckCircle, PlayCircle, Award, Compass, Dumbbell, BookOpen, 
  Wind, Droplet, ShieldAlert, Navigation
} from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import LogModal from '@/components/LogModal';
import { storage } from '@/lib/storage';
import { getMonthlyAdvice, calculateStreaks } from '@/lib/advice';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [advice, setAdvice] = useState(null);
  const [streaks, setStreaks] = useState({ cleanStreakDays: 0, trackingStreakDays: 0 });
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [commandFeedback, setCommandFeedback] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Authenticate client-side
    if (!storage.isRegistered()) {
      router.replace('/register');
      return;
    }

    const profile = storage.getUserProfile();
    setUser(profile);

    // Load data
    loadDashboardData();
  }, [router]);

  const loadDashboardData = () => {
    const userLogs = storage.getLogs();
    setLogs(userLogs);
    
    const monthlyAdvice = getMonthlyAdvice(userLogs);
    setAdvice(monthlyAdvice);

    const calculatedStreaks = calculateStreaks(userLogs);
    setStreaks(calculatedStreaks);
  };

  const handleSaveLog = (logEntry) => {
    storage.addLog(logEntry);
    loadDashboardData();
  };

  const handleCommandClick = (cmdText) => {
    setCommandFeedback(`Task Initiated: "${cmdText}". Focus redirected. Stay strong!`);
    setTimeout(() => setCommandFeedback(''), 4000);
  };

  // Map icon strings to Lucide components
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Dumbbell': return <Dumbbell className="h-5 w-5" />;
      case 'BookOpen': return <BookOpen className="h-5 w-5" />;
      case 'Wind': return <Wind className="h-5 w-5" />;
      case 'Droplet': return <Droplet className="h-5 w-5" />;
      case 'Zap': return <Zap className="h-5 w-5" />;
      case 'Navigation': return <Navigation className="h-5 w-5" />;
      case 'ShieldAlert': return <ShieldAlert className="h-5 w-5" />;
      default: return <Compass className="h-5 w-5" />;
    }
  };

  if (!user || !advice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
      </div>
    );
  }

  // Set style values based on scale
  const scaleColors = {
    LOW: { text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/10' },
    MEDIUM: { text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/10' },
    HIGH: { text: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/10', glow: 'shadow-rose-500/10' }
  };
  const activeStyle = scaleColors[advice.scale] || scaleColors.LOW;

  return (
    <div className="min-h-screen bg-zinc-950 pb-24 text-zinc-100 flex flex-col">
      <Header title="Dashboard" />

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
        {/* User Greeting */}
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Hello, {user.name.split(' ')[0]}
          </h2>
          <p className="text-xs text-zinc-400 font-semibold tracking-wide">
            Your offline personal wellness profile is synchronized.
          </p>
        </div>

        {/* Streak and Summary metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Clean Streak Card */}
          <div className="relative overflow-hidden rounded-2xl glass-panel border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Clean Streak</span>
              <Flame className="h-5 w-5 text-indigo-500 fill-indigo-500/20" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">
                {streaks.cleanStreakDays} <span className="text-sm font-semibold text-zinc-500">Days</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1 font-semibold">Since last entry</p>
            </div>
            {/* Absolute background accent */}
            <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-indigo-500/5 blur-xl" />
          </div>

          {/* Month Scale status */}
          <div className={`relative overflow-hidden rounded-2xl glass-panel border ${activeStyle.border} ${activeStyle.bg} p-5 flex flex-col justify-between h-32 shadow-lg ${activeStyle.glow}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Monthly Scale</span>
              <Zap className={`h-5 w-5 ${activeStyle.text}`} />
            </div>
            <div>
              <div className={`text-2xl font-black uppercase tracking-tight ${activeStyle.text}`}>
                {advice.level}
              </div>
              <p className="text-[10px] text-zinc-400 mt-1 font-semibold">{advice.totalCount} log entries (30d)</p>
            </div>
          </div>
        </div>

        {/* Command Feedback Toast */}
        {commandFeedback && (
          <div className="rounded-xl bg-indigo-600 border border-indigo-500/30 p-4 text-xs font-bold text-white flex items-center gap-2 animate-bounce">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{commandFeedback}</span>
          </div>
        )}

        {/* Predefined Dynamic Wellness Advice Card */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-400" />
            <h3 className="font-bold text-white tracking-tight">Personalized Advice</h3>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-indigo-300">
              {advice.title}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              {advice.scoreDescription}
            </p>
          </div>

          <ul className="space-y-2.5 pt-2">
            {advice.bulletAdvice.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Predefined Action Redirect commands */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Energy Redirection Commands
            </h3>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
              Tap to redirect
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {advice.commands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => handleCommandClick(cmd.text)}
                className="flex items-center justify-between w-full p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/20 hover:bg-zinc-800/40 hover:border-zinc-700 active:scale-[0.99] transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {getIcon(cmd.icon)}
                  </div>
                  <span className="text-xs font-bold text-zinc-200">
                    {cmd.text}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-500" />
              </button>
            ))}
          </div>
        </section>

        {/* Quick Log Action float button */}
        <div className="pt-4">
          <button
            onClick={() => setIsLogOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl py-4 font-bold shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all"
          >
            <Plus className="h-5 w-5" />
            <span>Record Wellness Entry</span>
          </button>
        </div>
      </main>

      <LogModal
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        onSave={handleSaveLog}
      />

      <BottomNav />
    </div>
  );
}
