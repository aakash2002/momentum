import { z } from "zod";

export const subtaskSchema = z.object({
  title: z.string(),
  estimate: z.number(),
  status: z.enum(["todo", "in_progress", "done"]),
  category: z.string().optional()
});

export const taskCardSchema = z.object({
  title: z.string(),
  category: z.string(),
  priority: z.enum(["Low", "Medium", "High"]),
  estimatedMinutes: z.number(),
  subtasks: z.array(subtaskSchema)
});

export const taskCardArraySchema = z.object({
  tasks: z.array(taskCardSchema)
});
