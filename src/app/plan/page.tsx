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
import { motion, AnimatePresence } from 'framer-motion';

// User-Defined Imports
import {Message, Subtask} from "@/types"
import ChatMessage from "@/components/ChatMessage"
import LandingScreen from '@/components/screens/LandingScreen';

export default function AIBreakdown() {
    const [showChat, setShowChat] = useState(false)
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-slate-900 to-gray-800 text-white overflow-hidden">
      {/* CTA Heading + Button Block */}
      <motion.div
        initial={false}
        animate={showChat ? 'chat' : 'hero'}
        variants={{
          hero: { y: 0, opacity: 1 },
          chat: { y: -140, opacity: 1 },
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="flex flex-col items-center text-center gap-6 absolute top-1/2 transform -translate-y-1/2"
      >
        <motion.h1
          className="text-4xl font-extrabold drop-shadow-lg"
          variants={{
            hero: { scale: 1.25 },
            chat: { scale: 1.0, y: -100},
          }}
          transition={{ duration: 0.75}}
        >
          What do you want to get done today?
        </motion.h1>

        <AnimatePresence>
          {!showChat && (
            <motion.div
              key="generate-button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <Button size="lg" onClick={() => setShowChat(true)}>
                Generate with AI
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat area: visible when showChat is true */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            key="chat-section"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full max-w-2xl mx-auto mt-[20vh] flex flex-col"
          >
            {/* Chat Messages Card */}
            <Card className="bg-white/5 border border-white/10 text-white shadow-xl overflow-hidden h-[400px]">
              <CardContent className="p-4 space-y-4 h-full overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center pt-4">
                    Start typing to describe your task…
                  </p>
                ) : (
                  messages.map((msg) => (
                    <ChatMessage
                      key={msg.id}
                      message={msg}
                      onConfirm={() => handleConfirm(msg.id)}
                      onEdit={() => handleEdit(msg.id)}
                      onRegenerate={() => handleRegenerate(msg.id)}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            {/* Input Area */}
            <div className="w-full relative mt-2">
              <Textarea
                rows={4}
                placeholder="Describe your task..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="pr-12 bg-white/5 border border-white/10 text-white placeholder:text-gray-400"
              />
              <Button
                size="icon"
                className="absolute bottom-2 right-2"
                onClick={handleSend}
              >
                <ArrowUpRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}