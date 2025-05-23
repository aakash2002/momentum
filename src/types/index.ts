export type Subtask = {
  title: string
  estimate: number
  status: "todo" | "in_progress" | "done"
  category?: string
}

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  subtasks?: Subtask[]
  confirmed?: boolean
  editing?: boolean
}