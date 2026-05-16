// src/components/ui/Button.tsx

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'premium';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-cyan-400/20 bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-sky-400',
  secondary:
    'border border-white/10 bg-white/8 text-white hover:bg-white/12',
  outline:
    'border border-white/15 bg-transparent text-white hover:bg-white/8 hover:border-white/25',
  ghost:
    'border border-transparent bg-transparent text-white/80 hover:bg-white/8 hover:text-white',
  destructive:
    'border border-red-400/20 bg-red-500/10 text-red-100 hover:bg-red-500/15 hover:text-white',
  premium:
    'border border-amber-400/20 bg-gradient-to-r from-amber-400/15 via-yellow-300/10 to-fuchsia-400/10 text-amber-50 shadow-lg shadow-amber-500/10 hover:from-amber-400/20 hover:to-fuchsia-400/15',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-xl px-3 text-sm',
  md: 'h-11 rounded-2xl px-4 text-sm',
  lg: 'h-12 rounded-2xl px-5 text-base',
  icon: 'h-11 w-11 rounded-2xl p-0',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold tracking-wide',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-60',
          'backdrop-blur-xl',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className={cn('h-4 w-4 animate-spin', size === 'icon' && 'h-4 w-4')} />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}

        {size !== 'icon' ? <span>{children}</span> : null}

        {!loading && rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
