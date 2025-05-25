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
  confirmed?: boolean
  editing?: boolean
}

export type TimerProps = {
  showControls: boolean;
  setShowControls: (value: boolean) => void;
  estimatedMinutes: number;
};