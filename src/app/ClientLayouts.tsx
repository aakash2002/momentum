'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { supabase } from '@/lib/supabase';
import TopNav from '@/components/TopNavbar';
import type { User } from '@supabase/supabase-js';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  const showNav = user && pathname !== '/login';

  if (loading) {
    return <p className="text-white text-center mt-10">Checking session...</p>;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {showNav && <TopNav user={user} />}
      {children}
    </ThemeProvider>
  );
}
