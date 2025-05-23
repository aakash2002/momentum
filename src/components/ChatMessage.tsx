import * as React from "react"
import {
    ArrowUpRight,
    RefreshCcw,
    Check,
    Pencil,
    Save,
    X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Message } from "@/types"

type Props = {
  message: Message
  onConfirm: () => void
  onEdit: () => void
  onRegenerate: () => void
}

export default function ChatMessage({ message, onConfirm, onEdit, onRegenerate }: Props) {
  
  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`px-4 py-2 rounded-lg max-w-xs break-words w-fit
        ${message.role === "user"
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"}`}>
        <p>{message.content}</p>

        {message.subtasks && (
          <ul className="list-disc pl-5 mt-2 space-y-2 text-sm text-foreground">
            {message.subtasks.map((task, idx) => (
              <li key={idx}>
                <div className="font-medium">{task.title}</div>
                <div className="text-xs text-muted-foreground">
                  ⏱ {task.estimate} min • {task.category}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Action Buttons */}
        {message.role === "assistant" && message.subtasks && !message.confirmed && !message.editing && (
          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            <span>Does this look okay?</span>
            {/* Accept Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onConfirm}
              className="text-green-600 hover:bg-green-100"
            >
              <Check className="w-4 h-4" />
            </Button>
            {/* Edit Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="text-blue-500 hover:bg-blue-100"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            {/* Regenerate Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onRegenerate}
              className="text-yellow-500 hover:bg-yellow-100"
            >
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}