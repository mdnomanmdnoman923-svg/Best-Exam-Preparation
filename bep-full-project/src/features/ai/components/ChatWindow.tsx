// bep-full-project/src/features/ai/components/ChatWindow.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUp,
  Bot,
  Copy,
  Mic,
  Paperclip,
  Sparkles,
  Wand2,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import ChatMessage, { ChatMessageData } from './ChatMessage';

export interface ChatWindowProps {
  messages: ChatMessageData[];
  loading?: boolean;
  typing?: boolean;
  disabled?: boolean;
  placeholder?: string;
  title?: string;
  subtitle?: string;
  quickPrompts?: string[];
  onSend: (message: string) => Promise<void> | void;
  onCopyMessage?: (content: string) => void;
  onQuickPrompt?: (prompt: string) => void;
  onAttach?: () => void;
  onVoice?: () => void;
}

export default function ChatWindow({
  messages,
  loading = false,
  typing = false,
  disabled = false,
  placeholder = 'এখানে প্রশ্ন লিখুন...',
  title = 'BEP AI Tutor',
  subtitle = 'বাংলায় instant explanation, smart hints এবং learning support',
  quickPrompts = [
    'এই প্রশ্নটা সহজভাবে বুঝিয়ে দাও',
    'স্টেপ বাই স্টেপ সলিউশন দাও',
    'এক্সামের জন্য শর্ট ট্রিক দাও',
  ],
  onSend,
  onCopyMessage,
  onQuickPrompt,
  onAttach,
  onVoice,
}: ChatWindowProps) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isEmpty = messages.length === 0;

  const canSend = useMemo(() => {
    return !disabled && !loading && !sending && input.trim().length > 0;
  }, [disabled, loading, sending, input]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  const handleSend = async () => {
    const value = input.trim();
    if (!value || disabled || loading || sending) return;

    try {
      setSending(true);
      setInput('');
      await onSend(value);
      requestAnimationFrame(() => inputRef.current?.focus());
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSend();
  };

  const handleQuickPrompt = async (prompt: string) => {
    if (disabled || loading || sending) return;
    setInput(prompt);
    onQuickPrompt?.(prompt);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div className="flex h-full min-h-[620px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_20px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-100 shadow-lg shadow-cyan-500/10">
              <Bot className="h-6 w-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  {title}
                </h2>

                <Badge variant="premium" dot>
                  AI Tutor
                </Badge>
              </div>

              <p className="mt-1 text-sm leading-6 text-white/60">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
              <Sparkles className="h-3.5 w-3.5" />
              Bengali-first assistant
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white/70">
              <Wand2 className="h-3.5 w-3.5" />
              Smart hints enabled
            </div>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-5 overflow-y-auto px-5 py-5"
      >
        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[420px] flex-col items-center justify-center text-center"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-100">
              <Bot className="h-11 w-11" />
            </div>

            <h3 className="mt-6 text-2xl font-bold tracking-tight text-white">
              BEP AI ready
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
              প্রশ্ন, chapter, or exam problem লিখুন। আমি বাংলায় explain করব,
              hint দেব, এবং প্রয়োজন হলে step-by-step solution দেখাব।
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleQuickPrompt(prompt)}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/75 transition hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onCopy={onCopyMessage}
              />
            ))}

            {typing && (
              <ChatMessage
                message={{
                  id: 'typing',
                  role: 'assistant',
                  content: '',
                  typing: true,
                  model: 'BEP AI',
                }}
              />
            )}
          </>
        )}
      </div>

      <div className="border-t border-white/10 p-4">
        {quickPrompts.length > 0 ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {quickPrompts.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleQuickPrompt(prompt)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/65 transition hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-white"
                disabled={disabled || loading || sending}
              >
                {prompt}
              </button>
            ))}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 lg:flex-row lg:items-end"
        >
          <div className="flex flex-1 items-end gap-2 rounded-3xl border border-white/10 bg-[#08111F]/80 p-3 backdrop-blur-xl">
            <button
              type="button"
              onClick={onAttach}
              disabled={disabled || loading || sending}
              className="mb-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/55 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            <div className="flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                disabled={disabled || loading || sending}
                className="h-10 border-0 bg-transparent px-1 text-sm shadow-none focus:ring-0"
                containerClassName="w-full"
              />
            </div>

            <button
              type="button"
              onClick={onVoice}
              disabled={disabled || loading || sending}
              className="mb-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/55 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>

          <Button
            type="submit"
            size="lg"
            loading={sending || loading}
            disabled={!canSend}
            rightIcon={<ArrowUp className="h-4 w-4" />}
            className="shrink-0"
          >
            পাঠান
          </Button>
        </form>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-white/40">
          <p>
            Shift + Enter ব্যবহার করে নতুন লাইন, Enter দিয়ে send।
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (messages.length === 0) return;
                const last = messages[messages.length - 1];
                navigator.clipboard.writeText(last.content).catch(() => undefined);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-white/55 transition hover:bg-white/[0.08] hover:text-white"
            >
              <Copy className="h-3.5 w-3.5" />
              সর্বশেষ কপি
            </button>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
