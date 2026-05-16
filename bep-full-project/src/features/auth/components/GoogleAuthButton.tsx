// bep-full-project/src/features/auth/components/GoogleAuthButton.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Chrome, Loader2, Sparkles } from 'lucide-react';

import Button from '@/components/ui/Button';

export interface GoogleAuthButtonProps {
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  subtitle?: string;
  fullWidth?: boolean;
  showSparkle?: boolean;
  onClick: () => Promise<void> | void;
  className?: string;
}

export default function GoogleAuthButton({
  loading = false,
  disabled = false,
  label = 'Google দিয়ে চালিয়ে যান',
  subtitle = 'Fast, secure এবং one-click authentication',
  fullWidth = true,
  showSparkle = true,
  onClick,
  className = '',
}: GoogleAuthButtonProps) {
  const handleClick = async () => {
    if (loading || disabled) return;
    await onClick();
  };

  return (
    <div className={className}>
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
      >
        <Button
          type="button"
          variant="secondary"
          fullWidth={fullWidth}
          disabled={disabled || loading}
          onClick={handleClick}
          className={[
            'group relative h-auto overflow-hidden rounded-3xl border border-white/10',
            'bg-white/[0.04] px-5 py-4 backdrop-blur-2xl',
            'transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.06]',
            'hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]',
          ].join(' ')}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_30%)] opacity-0 transition duration-300 group-hover:opacity-100" />

          <div className="relative z-10 flex w-full items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-cyan-200" />
                ) : (
                  <Chrome className="h-6 w-6 text-white" />
                )}
              </div>

              <div className="min-w-0 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-semibold tracking-wide text-white">
                    {label}
                  </h3>

                  {showSparkle && (
                    <div className="inline-flex items-center gap-1 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-2 py-0.5 text-[10px] font-semibold text-fuchsia-100">
                      <Sparkles className="h-3 w-3" />
                      Recommended
                    </div>
                  )}
                </div>

                <p className="mt-1 text-xs leading-5 text-white/50">
                  {subtitle}
                </p>
              </div>
            </div>

            <div className="hidden shrink-0 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-100 sm:inline-flex">
              Secure OAuth
            </div>
          </div>
        </Button>
      </motion.div>
    </div>
  );
}
