'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, ShieldAlert, Key, Phone, Calendar, Heart, 
  Trash2, ShieldCheck, Save, ArrowRight
} from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { storage } from '@/lib/storage';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    age: 0,
    dob: '',
    sex: '',
    phone: '',
    pin: ''
  });
  const [feedback, setFeedback] = useState({ message: '', type: '' });
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

    const profile = storage.getUserProfile();
    setFormData({
      name: profile.name || '',
      age: profile.age || 0,
      dob: profile.dob || '',
      sex: profile.sex || 'male',
      phone: profile.phone || '',
      pin: profile.pin || ''
    });
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateAge = (dobString) => {
    if (!dobString) return 0;
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Re-calculate age if DOB edits
  useEffect(() => {
    if (formData.dob) {
      const computedAge = calculateAge(formData.dob);
      if (computedAge !== formData.age) {
        setFormData(prev => ({ ...prev, age: computedAge }));
      }
    }
  }, [formData.dob]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback({ message: '', type: '' });

    if (!formData.name.trim()) return setFeedback({ message: 'Name cannot be empty.', type: 'error' });
    if (!formData.phone.trim()) return setFeedback({ message: 'Phone cannot be empty.', type: 'error' });
    if (String(formData.pin).length < 4) return setFeedback({ message: 'PIN must be at least 4 digits.', type: 'error' });

    try {
      const success = storage.updateUserProfile(formData);
      if (success) {
        setFeedback({ message: 'Profile updated successfully!', type: 'success' });
        setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
      } else {
        setFeedback({ message: 'Failed to update settings.', type: 'error' });
      }
    } catch (err) {
      setFeedback({ message: 'Error writing to storage.', type: 'error' });
    }
  };

  const handleWipeData = () => {
    router.push('/danger-zone');
  };

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground flex flex-col">
      <Header title="My Profile" />
 
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
        {/* Info card */}
        <section className="rounded-2xl border border-card-border bg-card-bg p-5 space-y-4">
          <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="font-bold text-foreground tracking-tight">Security Credentials</h3>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-semibold">
            Your physical and diagnostic logs are compiled entirely client-side. There is no server transfer. Your password PIN acts as a local screen lock to keep your dashboard private on this device.
          </p>
        </section>
 
        {/* Feedback Messages */}
        {feedback.message && (
          <div className={`rounded-xl border p-4 text-xs font-bold flex items-center gap-2 ${
            feedback.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
          }`}>
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
        )}
 
        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl bg-card-bg border border-card-border pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-foreground"
                required
              />
            </div>
          </div>
 
          {/* DOB & Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Age
              </label>
              <input
                type="text"
                name="age"
                value={formData.age}
                readOnly
                className="w-full rounded-xl bg-zinc-200/40 dark:bg-zinc-900/40 border border-card-border/80 px-4 py-3 text-sm text-zinc-500 cursor-not-allowed"
              />
            </div>
          </div>
 
          {/* Sex & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Sex
              </label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-foreground"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-card-bg border border-card-border pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-foreground"
                  required
                />
              </div>
            </div>
          </div>
 
          {/* PIN */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Lockscreen PIN Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <Key className="h-4 w-4" />
              </div>
              <input
                type="password"
                name="pin"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={6}
                value={formData.pin}
                onChange={handleChange}
                className="w-full rounded-xl bg-card-bg border border-card-border pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-foreground tracking-widest font-mono"
                required
              />
            </div>
          </div>
 
          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3.5 font-bold shadow-md active:scale-[0.98] transition-all"
            >
              <Save className="h-4.5 w-4.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
 
        <div className="border-t border-card-border pt-4" />
 
        {/* Destruction Actions */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Danger Zone
          </h3>
          <button
            onClick={handleWipeData}
            className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 dark:text-rose-400 rounded-xl py-3.5 text-xs font-bold active:scale-[0.98] transition-all"
          >
            <Trash2 className="h-4.5 w-4.5" />
            <span>Wipe All Local Storage Data</span>
          </button>
        </section>
      </main>
 
      <BottomNav />
    </div>
  );
}
