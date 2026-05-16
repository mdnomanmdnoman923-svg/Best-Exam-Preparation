// src/components/ui/Input.tsx

import React from 'react';
import { cn } from '@/lib/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || React.useId();

    return (
      <div className={cn('w-full', containerClassName)}>
        {label ? (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-white/85"
          >
            {label}
          </label>
        ) : null}

        <div className="relative">
          {leftIcon ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-white/40">
              {leftIcon}
            </div>
          ) : null}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'flex h-12 w-full rounded-2xl border px-4 text-sm outline-none transition-all duration-200',
              'bg-white/[0.04] text-white placeholder:text-white/35 backdrop-blur-2xl',
              'border-white/10 focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/15',
              'disabled:cursor-not-allowed disabled:opacity-60',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              error && 'border-red-400/30 focus:border-red-400/40 focus:ring-red-400/15',
              className,
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {rightIcon ? (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-white/40">
              {rightIcon}
            </div>
          ) : null}
        </div>

        {error ? (
          <p id={`${inputId}-error`} className="mt-2 text-sm text-red-300">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="mt-2 text-sm text-white/50">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
