// This file is responsible for rendering a task column with a list of tasks and their subtasks.

import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { TaskCardProps } from '@/types';
import { TimerIcon, Trash2Icon } from 'lucide-react';
import TaskCard from '@/components/TaskCard';

export default function TaskColumn({ title, tasks }: { title: string; tasks: TaskCardProps[] }) {
  return (
    <Card className="bg-white/5 border border-white/10 w-[30%] min-h-[500px] flex flex-col">
      <CardContent className="p-6 space-y-4 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-full w-full">
            <p className="text-gray-400 italic">No tasks</p>
          </div>
        ) : (
          tasks.map((task, idx) => (
            <div
              key={idx}
              className="bg-white/10 px-4 py-3 rounded-md text-sm text-white shadow-sm"
            >
              <div className="font-medium mb-2">
                <TaskCard key={idx} {...task} /></div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
