'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LineChart, CalendarCheck2, ListTodo, Settings, NotebookPen, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation'
import { useChatStore } from '@/stores/ChatStores';

const navItems = [
  { name: 'Planner', href: '/plan', icon: <CalendarCheck2 size={16} /> },
  { name: 'Task View', href: '/tasks', icon: <ListTodo size={16} /> },
  { name: 'Insights', href: '/insights', icon: <LineChart size={16} /> },
  { name: 'Reflections', href: '/reflection', icon: <NotebookPen size={16} /> },
];

export default function TopNav({ user }: { user: User }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const clearMessages = useChatStore((s) => s.clearMessages);

  // Clear chats upon logout
  const router = useRouter();

  const handleLogout = async () => {
      await supabase.auth.signOut();

      // Clear local chat state
      clearMessages();

      // Optional: Clear browser storage
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to login
      router.push('/login');
    };

  useEffect(() => setMounted(true), []);

  // Hide nav only on login page
  if (pathname === '/login') return null;

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-2 flex justify-between items-center shadow-sm">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-sm text-foreground">Momentum</span>
      </div>

      {/* Center: Navigation Tabs */}
      <nav className="flex space-x-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent/50",
                isActive ? "bg-accent text-primary" : "text-muted-foreground"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Right: Icons */}
      <div className="flex items-center gap-3 text-foreground">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hover:-translate-y-0.5 transition-transform"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}

        {user && (
          <>
            {/* TODO: Remove this later to show user's name and in a drop down callout like */}
            {/* <span className="text-xs text-muted-foreground hidden sm:inline">{user.email}</span> */}
            <button
              onClick={handleLogout}
              className="text-xs hover:text-red-400 transition"
            >
              Logout
            </button>
          </>
        )}

        <button className="hover:-translate-y-0.5 transition-transform">
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
}
