// src/components/common/PremiumBadge.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Sparkles,
} from 'lucide-react';

type PremiumBadgeVariant =
  | 'default'
  | 'gold'
  | 'purple'
  | 'success';

type PremiumBadgeProps = {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: PremiumBadgeVariant;
  animated?: boolean;
  icon?: boolean;
  className?: string;
};

const variantClasses: Record<PremiumBadgeVariant, string> = {
  default:
    'border-yellow-400/20 bg-yellow-400/10 text-yellow-200',
  gold:
    'border-amber-400/20 bg-gradient-to-r from-amber-400/15 to-yellow-300/10 text-yellow-100',
  purple:
    'border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-100',
  success:
    'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
};

const sizeClasses = {
  sm: 'px-2.5 py-1 text-[11px]',
  md: 'px-3.5 py-1.5 text-xs',
  lg: 'px-4 py-2 text-sm',
};

export default function PremiumBadge({
  label = 'Premium',
  size = 'md',
  variant = 'gold',
  animated = true,
  icon = true,
  className = '',
}: PremiumBadgeProps) {
  const Wrapper = animated ? motion.div : 'div';

  return (
    <Wrapper
      {...(animated
        ? {
            initial: { opacity: 0, scale: 0.92 },
            animate: { opacity: 1, scale: 1 },
            transition: {
              duration: 0.3,
            },
          }
        : {})}
      className={[
        'inline-flex items-center gap-2 rounded-full border font-semibold tracking-wide',
        'backdrop-blur-xl shadow-lg',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {icon && (
        <motion.div
          animate={
            animated
              ? {
                  rotate: [0, 8, -8, 0],
                }
              : undefined
          }
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          {variant === 'success' ? (
            <Sparkles className="h-4 w-4" />
          ) : (
            <Crown className="h-4 w-4" />
          )}
        </motion.div>
      )}

      <span>{label}</span>
    </Wrapper>
  );
}
