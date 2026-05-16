import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bep-primary/60 select-none font-bengali',
  {
    variants: {
      variant: {
        primary:  'bg-primary-gradient text-white shadow-glow-sm hover:shadow-glow-md',
        secondary:'bg-bep-surface border border-bep-border text-bep-text hover:bg-bep-card hover:border-bep-primary/40',
        ghost:    'text-bep-text-dim hover:text-bep-text hover:bg-bep-surface',
        danger:   'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20',
        gold:     'bg-gold-gradient text-bep-bg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]',
        outline:  'border border-bep-primary/50 text-bep-primary hover:bg-bep-primary/10',
      },
      size: {
        sm:   'text-xs px-3 py-2',
        md:   'text-sm px-5 py-2.5',
        lg:   'text-base px-7 py-3.5',
        icon: 'p-2.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
