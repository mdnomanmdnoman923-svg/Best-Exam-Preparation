import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  sessionId: string | null
  // Actions
  addMessage: (message: ChatMessage) => void
  setTyping: (typing: boolean) => void
  setSessionId: (id: string) => void
  clearChat: () => void
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      messages: [],
      isTyping: false,
      sessionId: null,

      addMessage: (message) =>
        set((s) => ({ messages: [...s.messages, message] }), false, 'chat/addMessage'),
      setTyping: (isTyping) => set({ isTyping }, false, 'chat/setTyping'),
      setSessionId: (id) => set({ sessionId: id }, false, 'chat/setSession'),
      clearChat: () => set({ messages: [], isTyping: false, sessionId: null }, false, 'chat/clear'),
    }),
    { name: 'ChatStore' }
  )
)
