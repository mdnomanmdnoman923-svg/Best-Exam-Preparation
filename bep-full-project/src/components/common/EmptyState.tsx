// src/components/common/EmptyState.tsx

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Sparkles,
} from 'lucide-react';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
  className?: string;
};

export default function EmptyState({
  title,
  description = 'এখানে এখনো কোনো ডাটা পাওয়া যায়নি।',
  icon,
  action,
  compact = false,
  className = '',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={[
        'relative overflow-hidden rounded-3xl border border-white/10',
        'bg-white/[0.04] backdrop-blur-2xl',
        compact ? 'p-6' : 'p-10 md:p-14',
        className,
      ].join(' ')}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={[
            'mb-6 flex items-center justify-center rounded-3xl border border-white/10',
            'bg-gradient-to-br from-cyan-400/10 to-indigo-500/10',
            compact ? 'h-20 w-20' : 'h-28 w-28',
          ].join(' ')}
        >
          {icon ?? (
            <div className="relative">
              <BookOpen className="h-10 w-10 text-cyan-300" />
              <Sparkles className="absolute -right-3 -top-2 h-5 w-5 text-yellow-300" />
            </div>
          )}
        </motion.div>

        <h3
          className={[
            'font-bold tracking-tight text-white',
            compact ? 'text-xl' : 'text-2xl md:text-3xl',
          ].join(' ')}
        >
          {title}
        </h3>

        <p
          className={[
            'mt-3 max-w-xl leading-7 text-white/65',
            compact ? 'text-sm' : 'text-base',
          ].join(' ')}
        >
          {description}
        </p>

        {action && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {action}
          </div>
        )}
      </div>
    </motion.div>
  );
}
