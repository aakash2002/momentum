'use client';

import TaskColumn from '@/components/TaskColumn';
import ProgressBar from '@/components/ProgressBar';
import { motion } from 'framer-motion';
import { TaskCardProps } from '@/types';

export default function TasksPage() {
  const tasks: {
      today: TaskCardProps[];
      completed: TaskCardProps[];
      backlog: TaskCardProps[];
    } = {
      today: [
        {
          title: 'Design UI',
          category: 'Design',
          priority: 'High',
          estimatedMinutes: 60,
          subtasks: [
            { title: 'Sketch layout', estimate: 15, status: 'todo' },
            { title: 'Build in Tailwind BABY RAWR', estimate: 45, status: 'todo' },
          ],
        },
      ],
      completed: [
        {
          title: 'API Integration',
          category: 'Dev',
          priority: 'Medium',
          estimatedMinutes: 30,
          subtasks: [
            { title: 'Define endpoints', estimate: 10, status: 'done' },
            { title: 'Connect frontend', estimate: 20, status: 'done' },
          ],
        },
      ],
      backlog: [],
    };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 px-8 py-16 text-white flex flex-col items-center justify-between">
      <div className="flex flex-col items-center justify-center flex-1 w-full gap-8 mt-10">
        <div className="flex justify-center gap-6 w-full max-w-7xl">
          <TaskColumn title="Today's Plan" tasks={tasks.today} />
          <TaskColumn title="Completed Tasks" tasks={tasks.completed} />
          <TaskColumn title="Backlog" tasks={tasks.backlog} />
        </div>

        <ProgressBar
          completed={tasks.completed.length}
          total={
            tasks.today.length + tasks.completed.length + tasks.backlog.length
          }
        />
      </div>
    </div>
  );
}
