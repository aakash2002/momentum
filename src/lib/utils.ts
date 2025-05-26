import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "@/lib/supabase";
import type { TaskCardProps } from "@/types";

export async function saveTasksToSupabase(tasks: TaskCardProps[]) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("No authenticated user found");
    return;
  }

  for (const task of tasks) {
    const { data: insertedTask, error: taskError } = await supabase
      .from("tasks")
      .insert({
        title: task.title,
        category: task.category,
        priority: task.priority,
        estimated_minutes: task.estimatedMinutes,
        user_id: user.id, // IMPORTANT: add user_id
      })
      .select()
      .single();

    if (taskError || !insertedTask) {
      console.error("Task insert error:", taskError);
      continue;
    }

    const formattedSubtasks = task.subtasks.map((subtask) => ({
      task_id: insertedTask.id,
      title: subtask.title,
      estimate: subtask.estimate,
      status: subtask.status,
      category: subtask.category || "",
      user_id: user.id, // Subtasks also need user_id
    }));

    const { error: subtaskError } = await supabase
      .from("subtasks")
      .insert(formattedSubtasks);

    if (subtaskError) {
      console.error(" Subtask insert error:", subtaskError);
    }
  }
}


export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
