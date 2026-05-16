import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium font-bengali',
  {
    variants: {
      variant: {
        default:  'bg-bep-primary/15 text-bep-primary border border-bep-primary/25',
        success:  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
        warning:  'bg-amber-500/15 text-amber-400 border border-amber-500/25',
        danger:   'bg-red-500/15 text-red-400 border border-red-500/25',
        muted:    'bg-bep-surface text-bep-text-dim border border-bep-border',
        gold:     'bg-amber-500/15 text-amber-300 border border-amber-500/30',
        accent:   'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
      },
    },
    defaultVariants: { variant: 'default', size: 'sm' },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}
