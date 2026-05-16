// src/components/common/CapybaraLoader.tsx

import React from 'react';
import { motion } from 'framer-motion';

type CapybaraLoaderProps = {
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeMap = {
  sm: {
    container: 'h-12 w-12',
    face: 'h-6 w-6',
    text: 'text-xs',
  },
  md: {
    container: 'h-16 w-16',
    face: 'h-8 w-8',
    text: 'text-sm',
  },
  lg: {
    container: 'h-20 w-20',
    face: 'h-10 w-10',
    text: 'text-base',
  },
} as const;

export default function CapybaraLoader({
  label = 'লোড হচ্ছে...',
  sublabel = 'অপেক্ষা করুন, BEP এখন প্রস্তুত হচ্ছে',
  size = 'md',
  className = '',
}: CapybaraLoaderProps) {
  const s = sizeMap[size];

  return (
    <div
      className={[
        'flex flex-col items-center justify-center gap-4',
        className,
      ].join(' ')}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <motion.div
        className={[
          'relative flex items-center justify-center rounded-full border border-white/10',
          'bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl',
          s.container,
        ].join(' ')}
        animate={{
          y: [0, -4, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_55%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.12),transparent_55%)]" />

        <motion.div
          className={[
            'relative rounded-full bg-gradient-to-br from-amber-200 via-orange-200 to-amber-300',
            s.face,
          ].join(' ')}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="absolute -left-1 top-1 h-2 w-2 rounded-full bg-amber-900/80" />
          <span className="absolute -right-1 top-1 h-2 w-2 rounded-full bg-amber-900/80" />
          <span className="absolute left-1/2 top-3 h-1 w-2 -translate-x-1/2 rounded-full bg-amber-900/70" />
          <span className="absolute bottom-1 left-1/2 h-1.5 w-3 -translate-x-1/2 rounded-full bg-amber-900/70" />
        </motion.div>

        <motion.div
          className="absolute -bottom-1 left-1/2 h-3 w-10 -translate-x-1/2 rounded-full bg-amber-500/30 blur-sm"
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <div className="text-center">
        <p className={['font-semibold tracking-wide text-white', s.text].join(' ')}>
          {label}
        </p>
        {sublabel ? (
          <p className="mt-1 text-xs leading-5 text-white/55">{sublabel}</p>
        ) : null}
      </div>
    </div>
  );
}
