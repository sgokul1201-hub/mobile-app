'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, User, Calendar, Phone, Heart, Key, Check } from 'lucide-react';
import { storage } from '@/lib/storage';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dob: '',
    sex: 'male',
    phone: '',
    pin: '',
    confirmPin: '',
    termsAccepted: false
  });
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // If already registered, skip to login
    if (storage.isRegistered()) {
      router.replace('/login');
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Auto-fill age when DOB changes
  useEffect(() => {
    if (formData.dob) {
      const computedAge = calculateAge(formData.dob);
      setFormData(prev => ({ ...prev, age: computedAge }));
    }
  }, [formData.dob]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Field Validations
    if (!formData.name.trim()) return setError('Please enter your name.');
    if (!formData.dob) return setError('Please select your date of birth.');
    if (!formData.phone.trim()) return setError('Please enter your phone number.');
    if (formData.pin.length < 4) return setError('Security PIN must be at least 4 digits.');
    if (formData.pin !== formData.confirmPin) return setError('Security PINs do not match.');
    if (!formData.termsAccepted) return setError('You must accept the terms of service.');

    try {
      const success = storage.registerUser(formData);
      if (success) {
        // Automatically set dark theme on register
        storage.updateSettings({ theme: 'dark' });
        router.push('/dashboard');
      } else {
        setError('Failed to save profile. LocalStorage might be disabled.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 text-zinc-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <Shield className="h-6 w-6" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
          Create Security Profile
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Your data is stored 100% locally. No servers. No trackers.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-panel border border-zinc-800 bg-zinc-900/60 p-8 rounded-2xl shadow-xl space-y-6">
          {error && (
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-sm font-semibold text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
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
                  placeholder="John Doe"
                  className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800 pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder-zinc-600"
                  required
                />
              </div>
            </div>

            {/* DOB & Age */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Age (Auto)
                </label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  readOnly
                  placeholder="--"
                  className="w-full rounded-xl bg-zinc-900/40 border border-zinc-800/80 px-4 py-3 text-sm text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Sex & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Sex
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
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
                    placeholder="+91 9876543210"
                    className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800 pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder-zinc-600"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Security PIN & Confirm */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Security PIN
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
                    placeholder="••••"
                    className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800 pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder-zinc-600 tracking-widest font-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Confirm PIN
                </label>
                <input
                  type="password"
                  name="confirmPin"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={6}
                  value={formData.confirmPin}
                  onChange={handleChange}
                  placeholder="••••"
                  className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder-zinc-600 tracking-widest font-mono"
                  required
                />
              </div>
            </div>

            {/* Terms and Privacy Agreement */}
            <div className="flex items-start mt-2">
              <div className="flex items-center h-5">
                <input
                  id="termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-zinc-800 text-indigo-600 focus:ring-indigo-500 bg-zinc-900"
                  required
                />
              </div>
              <div className="ml-3 text-xs">
                <label htmlFor="termsAccepted" className="font-semibold text-zinc-400">
                  I agree that this application is offline-first. All entries are stored directly in my browser/device localStorage and I accept the terms of tracking.
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/10 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all"
            >
              Initialize Profile & Storage
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
