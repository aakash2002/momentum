'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import SubtaskItem from './SubtaskItem';
import type { TaskCardProps } from '@/types';

export default function TaskCard({
  title,
  category,
  priority,
  subtasks,
}: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);

  const priorityColor = {
    Low: 'bg-green-500',
    Medium: 'bg-yellow-400',
    High: 'bg-red-500',
  }[priority];

  return (
    <motion.div
      layout
      className="bg-white/5 border border-white/10 rounded-md px-4 py-3 transition-all cursor-grab hover:scale-[1.01]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-start gap-3">
          <div className="flex flex-col">
            <div>
                <span className="text-white font-semibold text-base">{title}</span>
            </div>
            {expanded ? (
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-300">
                <span className="px-2 py-0.5 bg-white/10 rounded-full">{category}</span>
                <span
                  className={`w-2 h-2 rounded-full ${priorityColor}`}
                  title={`Priority: ${priority}`}
                />
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-1">
                <span className="px-2 py-0.5 bg-white/10 text-xs text-gray-300 rounded-full">{priority}</span>
              </div>
            )}
          </div>
        </div>

        <button onClick={() => setExpanded(!expanded)} className="text-gray-300">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Subtasks + Timer */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 overflow-hidden mb-2"
          >
            {subtasks.map((subtask, idx) => (
              <SubtaskItem
                key={idx}
                subtask={subtask}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
