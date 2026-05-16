// bep-full-project/src/features/ai/components/ChatMessage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  BrainCircuit,
  Copy,
  Sparkles,
  User,
} from 'lucide-react';

export interface ChatMessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string | Date;
  typing?: boolean;
  model?: string;
}

interface ChatMessageProps {
  message: ChatMessageData;
  showAvatar?: boolean;
  onCopy?: (content: string) => void;
}

function formatTime(date?: string | Date) {
  if (!date) return '';

  const parsed =
    typeof date === 'string'
      ? new Date(date)
      : date;

  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ChatMessage({
  message,
  showAvatar = true,
  onCopy,
}: ChatMessageProps) {
  const isAssistant =
    message.role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        message.content,
      );

      onCopy?.(message.content);
    } catch (error) {
      console.error(
        'Failed to copy message:',
        error,
      );
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className={[
        'flex w-full gap-4',
        isAssistant
          ? 'justify-start'
          : 'justify-end',
      ].join(' ')}
    >
      {isAssistant && showAvatar && (
        <div className="hidden pt-1 sm:block">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-100 shadow-lg shadow-cyan-500/10">
            <Bot className="h-5 w-5" />
          </div>
        </div>
      )}

      <div
        className={[
          'max-w-[92%] sm:max-w-[80%]',
          isAssistant
            ? 'items-start'
            : 'items-end',
          'flex flex-col',
        ].join(' ')}
      >
        <div
          className={[
            'relative overflow-hidden rounded-3xl border px-5 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-2xl',
            isAssistant
              ? 'border-cyan-400/15 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 text-white'
              : 'border-white/10 bg-white/[0.06] text-white',
          ].join(' ')}
        >
          <div
            className={[
              'absolute inset-0',
              isAssistant
                ? 'bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_30%)]'
                : 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_30%)]',
            ].join(' ')}
          />

          <div className="relative z-10">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={[
                    'flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide',
                    isAssistant
                      ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                      : 'border-white/10 bg-white/[0.05] text-white/80',
                  ].join(' ')}
                >
                  {isAssistant ? (
                    <>
                      <BrainCircuit className="h-3.5 w-3.5" />
                      AI Assistant
                    </>
                  ) : (
                    <>
                      <User className="h-3.5 w-3.5" />
                      You
                    </>
                  )}
                </div>

                {isAssistant &&
                  message.model && (
                    <div className="hidden items-center gap-1 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-2 py-1 text-[10px] font-semibold text-fuchsia-100 sm:flex">
                      <Sparkles className="h-3 w-3" />
                      {message.model}
                    </div>
                  )}
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>

            {message.typing ? (
              <div className="flex items-center gap-2 py-2">
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-300" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:120ms]" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:240ms]" />
              </div>
            ) : (
              <div className="space-y-4">
                {message.content
                  .split('\n')
                  .filter(Boolean)
                  .map((line, index) => (
                    <p
                      key={`${message.id}-${index}`}
                      className="text-sm leading-7 text-white/90"
                    >
                      {line}
                    </p>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div
          className={[
            'mt-2 flex items-center gap-2 px-2 text-xs text-white/35',
            isAssistant
              ? 'justify-start'
              : 'justify-end',
          ].join(' ')}
        >
          <span>
            {formatTime(message.createdAt)}
          </span>

          {isAssistant && (
            <>
              <span>•</span>

              <span>BEP AI</span>
            </>
          )}
        </div>
      </div>

      {!isAssistant && showAvatar && (
        <div className="hidden pt-1 sm:block">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white shadow-lg shadow-black/20">
            <User className="h-5 w-5" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
