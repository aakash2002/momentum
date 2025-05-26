'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Eye,
  RefreshCw,
  LineChart,
  Pencil
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const rotatingQuestions = [
  "What’s the one thing you absolutely need to get done today?",
  "Where do you want to start?",
  "Ready to conquer the day?",
  "What’s your main focus today?",
];

export default function LandingScreen({
  name,
  hasPlanForToday,
}: {
  name: string;
  hasPlanForToday: boolean;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setQuestionIndex((prev) => (prev + 1) % rotatingQuestions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-4"
    >
      <Card className="w-full max-w-xl bg-white/5 border border-white/10 shadow-xl">
        <CardContent className="space-y-6 py-10 text-center">
          {/* TODO: Remove this later once proper name and auth added */}
          {/* <h1 className="text-4xl font-extrabold text-white drop-shadow-md mt-8">
            Welcome, {name}!
          </h1> */}
          <h1 className="text-4xl font-extrabold text-white drop-shadow-md mt-8">
            Welcome!
          </h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={questionIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-lg text-gray-300 min-h-[28px] font-medium"
            >
              {rotatingQuestions[questionIndex]}
            </motion.p>
          </AnimatePresence>

          <div className="flex flex-col space-y-3 pt-2">
            {hasPlanForToday ? (
              <Button className="gap-2" onClick={() => router.push('/tasks')}>
                <Eye className="w-4 h-4" /> Show My Day
              </Button>
            ) : (
              <Button className="gap-2" onClick={() => router.push('/plan')}>
                <Calendar className="w-4 h-4" /> Let's Plan the Day
              </Button>
            )}
            <Button variant="outline" className="gap-2" onClick={() => router.push('/tasks')}>
              <RefreshCw className="w-4 h-4" /> Review Unfinished Tasks
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => alert('Feature coming soon!')}>
              <Pencil className="w-4 h-4" /> Reflect & Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
