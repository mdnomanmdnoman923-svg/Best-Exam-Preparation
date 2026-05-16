// src/components/common/ErrorState.tsx

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  RefreshCcw,
  WifiOff,
} from 'lucide-react';

type ErrorStateProps = {
  title?: string;
  description?: string;
  error?: string | null;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: ReactNode;
  compact?: boolean;
  className?: string;
};

export default function ErrorState({
  title = 'কিছু একটা সমস্যা হয়েছে',
  description = 'এখনই ডেটা লোড করা যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।',
  error,
  onRetry,
  retryLabel = 'আবার চেষ্টা করুন',
  icon,
  compact = false,
  className = '',
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={[
        'relative overflow-hidden rounded-3xl border border-red-400/15',
        'bg-white/[0.04] backdrop-blur-2xl',
        compact ? 'p-6' : 'p-8 md:p-10',
        className,
      ].join(' ')}
      role="alert"
      aria-live="assertive"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.10),transparent_30%)]" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={[
            'mb-5 flex items-center justify-center rounded-3xl border border-red-400/15',
            'bg-red-400/10 text-red-200 shadow-lg shadow-red-500/10',
            compact ? 'h-16 w-16' : 'h-20 w-20',
          ].join(' ')}
        >
          {icon ?? (
            <div className="relative">
              <AlertTriangle className={compact ? 'h-7 w-7' : 'h-8 w-8'} />
              <WifiOff className="absolute -right-2 -bottom-2 h-4 w-4 text-red-200/80" />
            </div>
          )}
        </motion.div>

        <h3 className="text-xl font-bold tracking-tight text-white">
          {title}
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-6 text-white/65 md:text-base">
          {description}
        </p>

        {error ? (
          <div className="mt-4 max-w-2xl rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Error details
            </p>
            <p className="mt-2 break-words text-sm leading-6 text-white/75">
              {error}
            </p>
          </div>
        ) : null}

        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className={[
              'mt-6 inline-flex items-center gap-2 rounded-full',
              'border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5',
              'text-sm font-semibold text-cyan-100 transition',
              'hover:bg-cyan-400/15 hover:text-white',
              'focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:ring-offset-0',
            ].join(' ')}
          >
            <RefreshCcw className="h-4 w-4" />
            {retryLabel}
          </button>
        ) : null}
      </div>
    </motion.div>
  );
}
