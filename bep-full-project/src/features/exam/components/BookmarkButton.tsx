// bep-full-project/src/features/exam/components/BookmarkButton.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bookmark,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';

export interface BookmarkButtonProps {
  questionId: string;
  bookmarked?: boolean;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'minimal';
  showLabel?: boolean;
  label?: string;
  activeLabel?: string;
  onToggle?: (
    questionId: string,
    nextState: boolean,
  ) => Promise<void> | void;
  className?: string;
}

const sizeClasses = {
  sm: {
    button:
      'h-10 px-3 text-xs rounded-xl',
    icon: 'h-4 w-4',
  },

  md: {
    button:
      'h-12 px-4 text-sm rounded-2xl',
    icon: 'h-5 w-5',
  },

  lg: {
    button:
      'h-14 px-5 text-sm rounded-2xl',
    icon: 'h-5 w-5',
  },
};

export default function BookmarkButton({
  questionId,
  bookmarked = false,
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'glass',
  showLabel = true,
  label = 'Bookmark',
  activeLabel = 'Saved',
  onToggle,
  className = '',
}: BookmarkButtonProps) {
  const [internalLoading, setInternalLoading] =
    useState(false);

  const [active, setActive] =
    useState(bookmarked);

  const isBusy =
    loading || internalLoading;

  const styles = useMemo(() => {
    switch (variant) {
      case 'minimal':
        return active
          ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
          : 'border-white/10 bg-transparent text-white/65 hover:bg-white/[0.05] hover:text-white';

      case 'default':
        return active
          ? 'border-cyan-400/20 bg-cyan-500 text-white shadow-[0_10px_35px_rgba(6,182,212,0.30)]'
          : 'border-white/10 bg-white text-slate-900 hover:opacity-90';

      case 'glass':
      default:
        return active
          ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100 shadow-[0_10px_40px_rgba(6,182,212,0.12)]'
          : 'border-white/10 bg-white/[0.04] text-white/70 hover:border-cyan-400/15 hover:bg-white/[0.07] hover:text-white';
    }
  }, [active, variant]);

  const handleToggle = async () => {
    if (
      disabled ||
      isBusy
    ) {
      return;
    }

    const nextState = !active;

    try {
      setInternalLoading(true);
      setActive(nextState);

      await onToggle?.(
        questionId,
        nextState,
      );
    } catch (error) {
      console.error(
        'Bookmark toggle failed:',
        error,
      );

      setActive(!nextState);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <motion.button
      type="button"
      whileTap={{
        scale: 0.96,
      }}
      whileHover={{
        y: -1,
      }}
      onClick={handleToggle}
      disabled={
        disabled || isBusy
      }
      className={[
        'group relative inline-flex items-center justify-center gap-2 overflow-hidden border font-semibold transition-all duration-300 backdrop-blur-xl',
        sizeClasses[size].button,
        styles,
        disabled
          ? 'cursor-not-allowed opacity-50'
          : '',
        className,
      ].join(' ')}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_35%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex items-center gap-2">
        {isBusy ? (
          <Loader2
            className={[
              'animate-spin',
              sizeClasses[size]
                .icon,
            ].join(' ')}
          />
        ) : active ? (
          <motion.div
            initial={{
              scale: 0.7,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            className="relative"
          >
            <Bookmark
              className={[
                'fill-current',
                sizeClasses[size]
                  .icon,
              ].join(' ')}
            />

            <Check className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-cyan-500 p-[1px] text-white" />
          </motion.div>
        ) : (
          <Bookmark
            className={[
              'transition duration-300 group-hover:scale-105',
              sizeClasses[size]
                .icon,
            ].join(' ')}
          />
        )}

        {showLabel ? (
          <span className="relative">
            {active
              ? activeLabel
              : label}
          </span>
        ) : null}

        {active &&
        variant ===
          'glass' ? (
          <Sparkles className="h-3.5 w-3.5 text-cyan-100/80" />
        ) : null}
      </div>
    </motion.button>
  );
}
