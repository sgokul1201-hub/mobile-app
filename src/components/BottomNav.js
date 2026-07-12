'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Calendar',
      href: '/calendar',
      icon: Calendar
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: User
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel safe-bottom border-t border-[var(--card-border)] backdrop-blur-md">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors group relative"
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex h-10 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                    : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <motion.div
                  animate={isActive 
                    ? { scale: 1.15, y: [0, -2, 0], rotate: [0, 5, -5, 0], opacity: 1 }
                    : { scale: 1, y: [0, -1.5, 0], rotate: [0, 2.5, -2.5, 0], opacity: [0.75, 1, 0.75] }
                  }
                  transition={{
                    y: { repeat: Infinity, duration: isActive ? 2 : 3, ease: "easeInOut" },
                    rotate: { repeat: Infinity, duration: isActive ? 2.4 : 3.6, ease: "easeInOut" },
                    opacity: { repeat: Infinity, duration: 3.2, ease: "easeInOut" },
                    scale: { type: "spring", stiffness: 300, damping: 15 }
                  }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
              </motion.div>
              <span
                className={`text-[10px] font-semibold tracking-wider transition-colors duration-300 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-zinc-400 dark:text-zinc-500'
                }`}
              >
                {item.label}
              </span>
              
              {isActive && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute top-0 h-0.5 w-8 bg-indigo-600 dark:bg-indigo-400 rounded-full" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
