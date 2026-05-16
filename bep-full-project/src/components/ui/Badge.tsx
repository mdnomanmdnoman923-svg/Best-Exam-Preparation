// src/components/ui/Badge.tsx

import React from 'react';
import { cn } from '@/lib/cn';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'warning'
  | 'danger'
  | 'premium';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100',
  secondary: 'border-white/10 bg-white/8 text-white/80',
  outline: 'border-white/15 bg-transparent text-white/75',
  success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
  warning: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
  danger: 'border-red-400/20 bg-red-500/10 text-red-100',
  premium: 'border-fuchsia-400/20 bg-gradient-to-r from-amber-400/15 to-fuchsia-400/10 text-amber-50',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', dot = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-xl',
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {dot ? <span className="h-2 w-2 rounded-full bg-current opacity-80" /> : null}
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
