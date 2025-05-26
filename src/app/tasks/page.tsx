'use client';

import TaskColumn from '@/components/TaskColumn';
import ProgressBar from '@/components/ProgressBar';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { TaskCardProps, Subtask } from '@/types';
import TaskCard from '@/components/TaskCard';

export default function TasksPage() {
  const [tasks, setTasks] = useState<{
  today: TaskCardProps[];
  completed: TaskCardProps[];
  backlog: TaskCardProps[];
}>({ today: [], completed: [], backlog: [] });

const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchTasks = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Not logged in");
      setLoading(false);
      return;
    }

    const { data: rawTasks, error: taskError } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("inserted_at", { ascending: false });

    if (taskError || !rawTasks) {
      console.error("Error loading tasks:", taskError);
      setLoading(false);
      return;
    }

    const categorized: {
      today: TaskCardProps[];
      completed: TaskCardProps[];
      backlog: TaskCardProps[];
    } = { today: [], completed: [], backlog: [] };

    for (const task of rawTasks) {
      const { data: subtasksData, error: subtasksError } = await supabase
        .from("subtasks")
        .select("*")
        .eq("task_id", task.id)
        .eq("user_id", user.id);

      if (subtasksError) continue;

      const subtasks: Subtask[] = (subtasksData || []).map((s) => ({
        title: s.title,
        estimate: s.estimate,
        status: s.status,
        category: s.category || '',
      }));

      const isAllDone = subtasks.every((s) => s.status === 'done');
      const isAllTodo = subtasks.every((s) => s.status === 'todo');

      const taskCard: TaskCardProps = {
        title: task.title,
        category: task.category,
        priority: task.priority,
        estimatedMinutes: task.estimated_minutes,
        subtasks,
      };

      if (isAllDone) categorized.completed.push(taskCard);
      else if (isAllTodo) categorized.backlog.push(taskCard);
      else categorized.today.push(taskCard);
    }

    setTasks(categorized);
    setLoading(false);
  };

  fetchTasks();
}, []);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading your tasks...
      </div>
    );
  }
  
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
