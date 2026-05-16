import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow, hover, padding = 'md', children, ...props }, ref) => {
    const paddings = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-6' }
    return (
      <div
        ref={ref}
        className={cn(
          'glass-card',
          paddings[padding],
          hover && 'hover:border-bep-primary/30 hover:shadow-card-hover cursor-pointer transition-all duration-300',
          glow && 'shadow-glow-sm',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-base font-semibold text-bep-text font-bengali', className)} {...props} />
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-bep-text-dim font-bengali mt-1', className)} {...props} />
}
