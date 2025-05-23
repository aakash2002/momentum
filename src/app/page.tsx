'use client'

// Components Import
import { useState } from "react"
import { nanoid } from "nanoid"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowUpRight
} from "lucide-react"

// User-Defined Imports
import {Message, Subtask} from "@/types"
import ChatMessage from "@/components/ChatMessage"


export default function Home() {
  const [text, setText] = useState("")
  const [messages, setMessages] = useState<Message[]>([])

   const handleConfirm = (id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, confirmed: true } : m
      )
    )
  }

  const handleEdit = (id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, editing: true } : m
      )
    )
  }

  const handleRegenerate = (id: string) => {
    alert("Regenerate feature coming soon")
  }

  const handleSend = () => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: nanoid(),
      role: "user",
      content: text.trim(),
    }

    const assistantMessage: Message = {
      id: nanoid(),
      role: "assistant",
      content: "Sure! Here's a breakdown:",
      confirmed: false,
      editing: false,
      subtasks: [
        {
          title: "Define the scope of the feature",
          estimate: 15,
          status: "todo",
          category: "planning"
        },
        {
          title: "Design the UI layout",
          estimate: 30,
          status: "todo",
          category: "design"
        },
        {
          title: "Implement component logic",
          estimate: 45,
          status: "todo",
          category: "development"
        },
        {
          title: "Test interaction flow",
          estimate: 20,
          status: "todo",
          category: "testing"
        }
      ]
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setText("")
  }

  return (
    <div className="flex flex-col items-center justify-end h-screen p-6">
      {/* Chat messages */}
      <Card className="w-full max-w-xl flex-1 overflow-y-auto mb-4">
        <CardContent className="space-y-4 py-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onConfirm={() => handleConfirm(msg.id)}
              onEdit={() => handleEdit(msg.id)}
              onRegenerate={() => handleRegenerate(msg.id)}
            />
          ))}
        </CardContent>
      </Card>

      {/* Input */}
      <div className="w-full max-w-xl relative">
        <Textarea
          rows={4}
          placeholder="Describe your task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          className="pr-12"
        />
        <Button
          size="icon"
          className="absolute bottom-2 right-2"
          onClick={handleSend}
        >
          <ArrowUpRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}