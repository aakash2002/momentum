import * as React from "react"
import { motion } from "framer-motion"
import { Message } from "@/types"
import PlanConfirmPrompt from "@/components/PlanConfirm"
import { Check, Pencil, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  message: Message
  onConfirm: () => void
  onEdit: () => void
  onRegenerate: () => void
}

export default function ChatMessage({ message, onConfirm, onEdit, onRegenerate }: Props) {
  const isAssistant = message.role === "assistant"

  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end "} mt-5 items-center w-full`}>
      <div
    className={`
      px-3 py-1.5 rounded-lg 
      ${isAssistant ? "bg-muted text-muted-foreground max-w-[90%]" : "bg-primary text-primary-foreground max-w-fit"}
      leading-snug text-base}`}
      >
        {/* Main message text */}
        <p className={`${isAssistant ? "mb-3" : ""}`}>{message.content}</p>

        {/* Task block rendering */}
        {message.tasks && (
          <div className="space-y-4">
            {message.tasks.map((task, idx) => (
              <div key={idx} className="bg-white/5 px-3 py-2 rounded-md space-y-1">
                <h4 className="font-semibold text-white/90">{task.title}</h4>
                <ul className="list-disc pl-5 text-sm space-y-1 text-white">
                  {task.subtasks.map((sub, i) => (
                    <li key={i}>
                      <div className="font-medium">{sub.title}</div>
                      <div className="text-xs text-muted-foreground">
                        ⏱ {sub.estimate} min • {sub.category}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Optional subtasks fallback */}
        {!message.tasks && message.subtasks && (
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

        {/* Action buttons for confirmation, editing, regen */}
        {isAssistant && message.subtasks && !message.confirmed && !message.editing && (
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <span>Does this look okay?</span>
            <Button variant="ghost" size="icon" onClick={onConfirm}>
              <Check className="w-4 h-4 text-green-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Pencil className="w-4 h-4 text-blue-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onRegenerate}>
              <RefreshCcw className="w-4 h-4 text-yellow-500" />
            </Button>
          </div>
        )}

        {/* CTA prompt */}
        {message.askToSchedule && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <PlanConfirmPrompt onConfirm={onConfirm} />
          </motion.div>
        )}
      </div>
    </div>
  )
}
