'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LandingScreen from '@/components/screens/LandingScreen';

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const hasPlanForToday = false; // For now, hardcoded

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUserName(user.user_metadata?.full_name || user.email);
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  return <LandingScreen name={userName || 'User'} hasPlanForToday={hasPlanForToday} />;
}
