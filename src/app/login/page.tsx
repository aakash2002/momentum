'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
  supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
        router.push('/');
        }
    });
    }, []);


  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/',
      },
    });

    if (error) {
      setMessage('Login failed. Try again.');
    } else {
      setMessage('Check your email for a magic link!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/5 backdrop-blur p-8 rounded-xl shadow-xl max-w-sm w-full text-white"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">Welcome to Momentum</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Login with your email to get started</p>

        <input
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-2 mb-4 bg-white/10 rounded focus:outline-none text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-200 transition"
        >
          Send Magic Link
        </button>

        {message && <p className="text-sm text-center text-gray-300 mt-4">{message}</p>}
      </motion.div>
    </div>
  );
}
