// bep-full-project/src/store/chat.store.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isRead?: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type?: string;
  }>;
  metadata?: Record<string, unknown>;
}

export interface ChatConversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  pinned?: boolean;
  archived?: boolean;
  participantIds?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  loading: boolean;
  sending: boolean;
  streaming: boolean;
  error: string | null;
  searchQuery: string;
  selectedConversationIds: string[];
  draftByConversationId: Record<string, string>;

  setConversations: (conversations: ChatConversation[]) => void;
  upsertConversation: (conversation: ChatConversation) => void;
  removeConversation: (conversationId: string) => void;

  setMessages: (conversationId: string, messages: ChatMessage[]) => void;
  appendMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (
    conversationId: string,
    messageId: string,
    patch: Partial<ChatMessage>,
  ) => void;
  removeMessage: (conversationId: string, messageId: string) => void;

  setActiveConversationId: (conversationId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setSending: (sending: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setError: (error: string | null) => void;

  setSearchQuery: (query: string) => void;
  toggleConversationSelection: (conversationId: string) => void;
  clearSelectedConversations: () => void;

  setDraft: (conversationId: string, draft: string) => void;
  clearDraft: (conversationId: string) => void;

  markConversationRead: (conversationId: string) => void;
  markAllRead: () => void;
  pinConversation: (conversationId: string, pinned?: boolean) => void;
  archiveConversation: (conversationId: string, archived?: boolean) => void;

  resetChat: () => void;

  getActiveConversation: () => ChatConversation | null;
  getActiveMessages: () => ChatMessage[];
  getUnreadTotal: () => number;
}

const initialState = {
  conversations: [],
  messages: {},
  activeConversationId: null,
  loading: false,
  sending: false,
  streaming: false,
  error: null,
  searchQuery: '',
  selectedConversationIds: [],
  draftByConversationId: {},
};

function sortConversations(items: ChatConversation[]) {
  return [...items].sort((a, b) => {
    const pinnedDiff = Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
    if (pinnedDiff !== 0) return pinnedDiff;

    const aTime = new Date(a.lastMessageAt ?? a.updatedAt ?? a.createdAt).getTime();
    const bTime = new Date(b.lastMessageAt ?? b.updatedAt ?? b.createdAt).getTime();
    return bTime - aTime;
  });
}

function sortMessages(items: ChatMessage[]) {
  return [...items].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setConversations: (conversations) => {
        set({ conversations: sortConversations(conversations) });
      },

      upsertConversation: (conversation) => {
        set((state) => {
          const index = state.conversations.findIndex((item) => item.id === conversation.id);
          const next = [...state.conversations];

          if (index >= 0) {
            next[index] = { ...next[index], ...conversation };
          } else {
            next.push(conversation);
          }

          return { conversations: sortConversations(next) };
        });
      },

      removeConversation: (conversationId) => {
        set((state) => {
          const nextConversations = state.conversations.filter((item) => item.id !== conversationId);
          const nextMessages = { ...state.messages };
          delete nextMessages[conversationId];

          return {
            conversations: nextConversations,
            messages: nextMessages,
            selectedConversationIds: state.selectedConversationIds.filter(
              (id) => id !== conversationId,
            ),
            activeConversationId:
              state.activeConversationId === conversationId
                ? null
                : state.activeConversationId,
            draftByConversationId: Object.fromEntries(
              Object.entries(state.draftByConversationId).filter(
                ([key]) => key !== conversationId,
              ),
            ),
          };
        });
      },

      setMessages: (conversationId, messages) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: sortMessages(messages),
          },
        }));
      },

      appendMessage: (conversationId, message) => {
        set((state) => {
          const current = state.messages[conversationId] ?? [];
          const nextMessages = sortMessages([...current, message]);

          const updatedConversations = state.conversations.map((conversation) => {
            if (conversation.id !== conversationId) return conversation;

            return {
              ...conversation,
              lastMessage: message.content,
              lastMessageAt: message.createdAt,
              updatedAt: message.updatedAt ?? message.createdAt,
              unreadCount:
                message.role === 'assistant' ? conversation.unreadCount + 1 : conversation.unreadCount,
            };
          });

          return {
            messages: {
              ...state.messages,
              [conversationId]: nextMessages,
            },
            conversations: sortConversations(updatedConversations),
          };
        });
      },

      updateMessage: (conversationId, messageId, patch) => {
        set((state) => {
          const current = state.messages[conversationId] ?? [];
          const nextMessages = current.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  ...patch,
                  updatedAt: new Date().toISOString(),
                }
              : message,
          );

          return {
            messages: {
              ...state.messages,
              [conversationId]: sortMessages(nextMessages),
            },
          };
        });
      },

      removeMessage: (conversationId, messageId) => {
        set((state) => {
          const current = state.messages[conversationId] ?? [];
          const nextMessages = current.filter((message) => message.id !== messageId);

          return {
            messages: {
              ...state.messages,
              [conversationId]: nextMessages,
            },
          };
        });
      },

      setActiveConversationId: (conversationId) => {
        set({ activeConversationId: conversationId });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setSending: (sending) => {
        set({ sending });
      },

      setStreaming: (streaming) => {
        set({ streaming });
      },

      setError: (error) => {
        set({ error });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      toggleConversationSelection: (conversationId) => {
        set((state) => {
          const selected = state.selectedConversationIds.includes(conversationId);

          return {
            selectedConversationIds: selected
              ? state.selectedConversationIds.filter((id) => id !== conversationId)
              : [...state.selectedConversationIds, conversationId],
          };
        });
      },

      clearSelectedConversations: () => {
        set({ selectedConversationIds: [] });
      },

      setDraft: (conversationId, draft) => {
        set((state) => ({
          draftByConversationId: {
            ...state.draftByConversationId,
            [conversationId]: draft,
          },
        }));
      },

      clearDraft: (conversationId) => {
        set((state) => {
          const next = { ...state.draftByConversationId };
          delete next[conversationId];

          return { draftByConversationId: next };
        });
      },

      markConversationRead: (conversationId) => {
        set((state) => {
          const messages = state.messages[conversationId] ?? [];
          const nextMessages = messages.map((message) => ({
            ...message,
            isRead: true,
          }));

          const nextConversations = state.conversations.map((conversation) =>
            conversation.id === conversationId
              ? { ...conversation, unreadCount: 0 }
              : conversation,
          );

          return {
            messages: {
              ...state.messages,
              [conversationId]: nextMessages,
            },
            conversations: sortConversations(nextConversations),
          };
        });
      },

      markAllRead: () => {
        set((state) => {
          const nextMessages: Record<string, ChatMessage[]> = {};

          for (const [conversationId, messages] of Object.entries(state.messages)) {
            nextMessages[conversationId] = messages.map((message) => ({
              ...message,
              isRead: true,
            }));
          }

          return {
            messages: nextMessages,
            conversations: state.conversations.map((conversation) => ({
              ...conversation,
              unreadCount: 0,
            })),
          };
        });
      },

      pinConversation: (conversationId, pinned) => {
        set((state) => ({
          conversations: sortConversations(
            state.conversations.map((conversation) =>
              conversation.id === conversationId
                ? {
                    ...conversation,
                    pinned: typeof pinned === 'boolean' ? pinned : !conversation.pinned,
                    updatedAt: new Date().toISOString(),
                  }
                : conversation,
            ),
          ),
        }));
      },

      archiveConversation: (conversationId, archived) => {
        set((state) => ({
          conversations: sortConversations(
            state.conversations.map((conversation) =>
              conversation.id === conversationId
                ? {
                    ...conversation,
                    archived: typeof archived === 'boolean' ? archived : !conversation.archived,
                    updatedAt: new Date().toISOString(),
                  }
                : conversation,
            ),
          ),
        }));
      },

      resetChat: () => {
        set({
          ...initialState,
          loading: false,
        });
      },

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get();
        return conversations.find((conversation) => conversation.id === activeConversationId) ?? null;
      },

      getActiveMessages: () => {
        const { activeConversationId, messages } = get();
        if (!activeConversationId) return [];
        return messages[activeConversationId] ?? [];
      },

      getUnreadTotal: () => {
        return get().conversations.reduce((sum, conversation) => sum + (conversation.unreadCount ?? 0), 0);
      },
    }),
    {
      name: 'bep-chat-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        messages: state.messages,
        activeConversationId: state.activeConversationId,
        searchQuery: state.searchQuery,
        selectedConversationIds: state.selectedConversationIds,
        draftByConversationId: state.draftByConversationId,
      }),
    },
  ),
);

/* -------------------------------------------------------------------------- */
/*                               Helper Selectors                             */
/* -------------------------------------------------------------------------- */

export const chatSelectors = {
  conversations: (state: ChatState) => state.conversations,
  messages: (state: ChatState) => state.messages,
  activeConversationId: (state: ChatState) => state.activeConversationId,
  loading: (state: ChatState) => state.loading,
  sending: (state: ChatState) => state.sending,
  streaming: (state: ChatState) => state.streaming,
  error: (state: ChatState) => state.error,
  searchQuery: (state: ChatState) => state.searchQuery,
  selectedConversationIds: (state: ChatState) => state.selectedConversationIds,
  draftByConversationId: (state: ChatState) => state.draftByConversationId,
  unreadTotal: (state: ChatState) =>
    state.conversations.reduce((sum, conversation) => sum + (conversation.unreadCount ?? 0), 0),
};
