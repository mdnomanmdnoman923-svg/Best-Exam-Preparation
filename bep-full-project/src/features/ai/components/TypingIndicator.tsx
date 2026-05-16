// bep-full-project/src/features/ai/components/TypingIndicator.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';

export interface TypingIndicatorProps {
  label?: string;
  subtitle?: string;
  compact?: boolean;
  className?: string;
}

export default function TypingIndicator({
  label = 'BEP AI typing',
  subtitle = 'বাংলায় উত্তর প্রস্তুত হচ্ছে...',
  compact = false,
  className = '',
}: TypingIndicatorProps) {
  return (
    <div
      className={[
        'flex w-full items-start gap-4',
        className,
      ].join(' ')}
      aria-live="polite"
      aria-label="Typing indicator"
    >
      <div className="hidden pt-1 sm:block">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-100 shadow-lg shadow-cyan-500/10">
          <Bot className="h-5 w-5" />
        </div>
      </div>

      <div className="max-w-[90%] sm:max-w-[80%]">
        <div
          className={[
            'relative overflow-hidden rounded-3xl border border-cyan-400/15',
            'bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 px-5 py-4',
            'shadow-[0_10px_40px_rgba(0,0,0,0.22)] backdrop-blur-2xl',
            compact ? 'px-4 py-3' : '',
          ].join(' ')}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_28%)]" />

          <div className="relative z-10 flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]"
            >
              <Sparkles className="h-4 w-4 text-cyan-200" />
            </motion.div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-wide text-white">
                  {label}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-100">
                  Online
                </span>
              </div>

              <p className="mt-1 text-sm leading-6 text-white/60">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-4 flex items-center gap-2 pl-13">
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:0ms]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:120ms]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:240ms]" />
          </div>
        </div>

        <div className="mt-2 px-2 text-xs text-white/35">
          AI is generating a Bengali-first response
        </div>
      </div>
    </div>
  );
}
