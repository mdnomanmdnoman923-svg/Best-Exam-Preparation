import { cn } from '@/lib/cn'

interface PremiumBadgeProps {
  className?: string
  size?: 'sm' | 'md'
}

export function PremiumBadge({ className, size = 'sm' }: PremiumBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-semibold rounded-full',
        'bg-gradient-to-r from-amber-500/20 to-yellow-400/20',
        'border border-amber-500/30 text-amber-400',
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1',
        className
      )}
    >
      ⭐ প্রিমিয়াম
    </span>
  )
}
