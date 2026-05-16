// src/components/common/LoadingScreen.tsx

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';

type LoadingScreenProps = {
  title?: string;
  subtitle?: string;
  showProgress?: boolean;
  progress?: number;
};

export default function LoadingScreen({
  title = 'লোড হচ্ছে...',
  subtitle = 'আপনার শেখার যাত্রা প্রস্তুত করা হচ্ছে',
  showProgress = false,
  progress = 0,
}: LoadingScreenProps) {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] text-white">
      <AnimatedBackground intensity="high" />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              aria-hidden="true"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10"
            >
              <div className="h-6 w-6 rounded-full border-2 border-cyan-300 border-t-transparent" />
            </motion.div>

            <h1 className="text-xl font-semibold tracking-wide text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/70">
              {subtitle}
            </p>

            {showProgress ? (
              <div className="mt-6 w-full">
                <div className="mb-2 flex items-center justify-between text-xs text-white/55">
                  <span>প্রসেসিং</span>
                  <span>{safeProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${safeProgress}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-6 flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-300 [animation-delay:150ms]" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-300 [animation-delay:300ms]" />
              </div>
            )}
          </div>
        </motion.div>

        <p className="mt-5 text-xs text-white/40">
          BEP • Bengali-first EdTech experience
        </p>
      </div>
    </div>
  );
}
