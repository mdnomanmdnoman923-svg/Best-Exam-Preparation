import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-bep-text-dim font-bengali block">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bep-muted">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input-bep',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-bep-muted">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-400 font-bengali">{error}</p>}
        {hint && !error && <p className="text-xs text-bep-text-muted font-bengali">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
