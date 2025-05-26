'use client'

// Components Import
import { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowUpRight
} from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion';

// User-Defined Imports
import {Message, Subtask, TaskCardProps} from "@/types"
import ChatMessage from "@/components/ChatMessage"
import { useChatStore } from "@/stores/ChatStores"
import ScheduleSuccess from "@/components/ScheduleSuccess"
import { saveTasksToSupabase } from "@/lib/utils";


type ParsedAIResponse =
  | { type: "clarification"; content: string }
  | { type: "plan"; intro: string; tasks: TaskCardProps[] };

export default function AIBreakdown() {
    // Clear chat messages when navigating to this page
   const clearMessages = useChatStore((s) => s.clearMessages)

    useEffect(() => {
      clearMessages()
      console.log("Cleared chat on /ai mount")
    }, [])

    // Only show if plan is confirmed
    const [showSuccess, setShowSuccess] = useState(false)

    const [showChat, setShowChat] = useState(false)
    const [text, setText] = useState("")
    const messages = useChatStore((s) => s.messages)
    const addMessage = useChatStore((s) => s.addMessage)
    const updateMessage = useChatStore((s) => s.updateMessage)
    const regenerateMessage = useChatStore((s) => s.regenerateMessage) // optional

    const handleConfirm = (id: string) => {
        // Save tasks to database
        const message = messages.find((m) => m.id === id);

        if (!message || !message.tasks || message.tasks.length === 0) {
          console.warn("No tasks to save for message:", id);
          return;
        }
        console.log("Saving tasks to DB");
        saveTasksToSupabase(message.tasks)

        updateMessage(id, { confirmed: true, askToSchedule: false })
        setShowSuccess(true)
    };

    const handleEdit = (id: string) => updateMessage(id, { editing: true });


  const handleRegenerate = async (id: string) => {
      const targetMessage = messages.find((m) => m.id === id);
      if (!targetMessage) return;

      regenerateMessage(id); // Optionally shows a "regenerating..." placeholder

      const res = await fetch("/api/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: targetMessage.content }),
      });

      const raw = await res.text();

      if (!res.ok) {
        console.error("Error:", raw);
        updateMessage(id, { content: "Failed to regenerate." });
        return;
      }

      let data: ParsedAIResponse;
      try {
        data = JSON.parse(raw);
      } catch (err) {
        updateMessage(id, { content: "Parse error from server." });
        return;
      }

      if (data.type === "plan") {
        updateMessage(id, {
          content: data.intro || targetMessage.content,
          subtasks: data.tasks?.[0]?.subtasks ?? [],
          confirmed: false,
          editing: false,
        });
      }
    };


  const handleSend = async () => {
  if (!text.trim()) return;

  const userMessage: Message = {
    id: nanoid(),
    role: "user",
    content: text.trim(),
  };

  addMessage(userMessage);
  setText("");

  // Clear any previous askToSchedule flags
  messages.forEach((msg) => {
    if (msg.askToSchedule) {
      updateMessage(msg.id, { askToSchedule: false });
    }
  });
  // Add history to past messages
  const geminiFormatted = [...messages, userMessage].map((m) => ({
  role: m.role,
  parts: [{ text: m.content }],
  }));

  try {
    const res = await fetch("/api/breakdown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: geminiFormatted })
    });

    const raw = await res.text();
    console.log("Raw API response text:", raw);

    if (!res.ok) {
      console.error("Non-OK response:", raw);
      alert("Backend returned an error.");
      return;
    }

    let data: ParsedAIResponse;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      alert("Invalid response from server.");
      return;
    }

    if (data.type === "clarification") {
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: data.content,
      });
    } 
    else if (data.type === "plan") {
  const planMessage: Message = {
    id: nanoid(),
    role: "assistant",
    content: data.intro, // e.g. "Sure! Here's your plan for the day:"
    tasks: data.tasks.map((task) => ({
      ...task,
      subtasks: task.subtasks.map((subtask) => ({
        ...subtask,
        status: subtask.status as "todo" | "in_progress" | "done",
      })),
    })),
    askToSchedule: true
  };

  addMessage(planMessage);
}   
  } catch (err) {
    console.error("Failed to get breakdown", err);
    alert("Something went wrong generating tasks.");
  }
};

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
            className="w-full max-w-2xl mx-auto mt-[10vh] flex flex-col"
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
      <ScheduleSuccess show={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}