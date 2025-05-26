// src/stores/chatStore.ts
import { create } from 'zustand';
import type { Message } from '@/types/index';

type ChatStore = {
  messages: Message[];
  addMessage: (msg: Message) => void;
  updateMessage: (id: string, updated: Partial<Message>) => void;
  clearMessages: () => void;
  regenerateMessage: (id: string) => void; // (Optional) Can set placeholder or loading
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  updateMessage: (id, updated) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, ...updated } : m)),
    })),
  clearMessages: () => set({ messages: [] }),
  regenerateMessage: (id) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id
          ? {
              ...m,
              content: '[Regenerating response...]',
              subtasks: [],
              confirmed: false,
            }
          : m
      ),
    })),
}));
