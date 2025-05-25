'use client';

import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  PlayIcon,
  PauseIcon,
  StopCircleIcon,
  Trash2Icon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Subtask } from '@/types';

export default function SubtaskItem({ subtask }: { subtask: Subtask }) {
  const [checked, setChecked] = useState(subtask.status === 'done');
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(subtask.estimate * 60);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <motion.div layout className="w-full text-sm text-white space-y-1">
      <div className="flex justify-between items-start gap-2 flex-wrap">
        {/* Left: checkbox + title */}
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <Checkbox
            checked={checked}
            onCheckedChange={(value) => setChecked(!!value)}
            className="mt-0.5"
          />
          <span
            className={`break-words ${checked ? 'line-through text-gray-400' : ''}`}
          >
            {subtask.title}
          </span>
        </div>

        {/* Right: controls, aligned right */}
        <div className="flex items-center gap-2 justify-end flex-shrink-0 whitespace-nowrap">
          {!hasStarted ? (
            <>
              <span className="text-xs text-gray-400">({subtask.estimate} min)</span>
              <PlayIcon
                className="w-4 h-4 cursor-pointer text-gray-300 hover:text-white"
                onClick={() => {
                  setIsRunning(true);
                  setHasStarted(true);
                }}
              />
              <Trash2Icon className="w-4 h-4 text-red-400 hover:text-red-300 cursor-pointer" />
            </>
          ) : (
            <div className="flex items-center gap-2 px-2 py-1 bg-white/10 rounded-md text-xs font-mono">
            {isRunning ? (
            <PauseIcon
                className="w-4 h-4 cursor-pointer"
                onClick={() => setIsRunning(false)}
            />
            ) : (
            <PlayIcon
                className="w-4 h-4 cursor-pointer"
                onClick={() => setIsRunning(true)}
            />
              )}
              <StopCircleIcon
                className="w-4 h-4 text-yellow-400 cursor-pointer"
                onClick={() => {
                  setIsRunning(false);
                  setHasStarted(false);
                  setTimeLeft(subtask.estimate * 60);
                }}
              />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
