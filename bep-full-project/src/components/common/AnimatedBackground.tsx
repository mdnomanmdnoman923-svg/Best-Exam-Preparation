// src/components/common/AnimatedBackground.tsx

import React from 'react';
import { motion } from 'framer-motion';

type AnimatedBackgroundProps = {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
};

const blobVariants = {
  animate: (custom: { delay: number; duration: number; x: number; y: number }) => ({
    x: [0, custom.x, 0],
    y: [0, custom.y, 0],
    transition: {
      duration: custom.duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: custom.delay,
    },
  }),
};

export default function AnimatedBackground({
  className = '',
  intensity = 'medium',
}: AnimatedBackgroundProps) {
  const opacityMap = {
    low: 'opacity-30',
    medium: 'opacity-50',
    high: 'opacity-70',
  } as const;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_28%),radial-gradient(circle_at_bottom,rgba(14,165,233,0.10),transparent_35%)]" />

      <motion.div
        aria-hidden="true"
        className={`absolute -left-24 top-8 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl ${opacityMap[intensity]}`}
        variants={blobVariants}
        animate="animate"
        custom={{ delay: 0, duration: 16, x: 110, y: 40 }}
      />

      <motion.div
        aria-hidden="true"
        className={`absolute right-[-5rem] top-32 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl ${opacityMap[intensity]}`}
        variants={blobVariants}
        animate="animate"
        custom={{ delay: 1, duration: 18, x: -100, y: 70 }}
      />

      <motion.div
        aria-hidden="true"
        className={`absolute bottom-[-6rem] left-1/3 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl ${opacityMap[intensity]}`}
        variants={blobVariants}
        animate="animate"
        custom={{ delay: 0.5, duration: 20, x: 80, y: -50 }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:44px_44px] opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070B14]/20 via-transparent to-[#070B14]/70" />
    </div>
  );
}
