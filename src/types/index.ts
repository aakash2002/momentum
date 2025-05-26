export type Subtask = {
  title: string
  estimate: number
  status: "todo" | "in_progress" | "done"
  category?: string
}

export type TaskCardProps = {
  title: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  estimatedMinutes: number;
  subtasks: Subtask[];
};

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  subtasks?: Subtask[]
  tasks?: TaskCardProps[]
  confirmed?: boolean
  editing?: boolean
  askToSchedule?: boolean;  // Track -- if reached the last subtask in plan, render the Ui button to schedule
}