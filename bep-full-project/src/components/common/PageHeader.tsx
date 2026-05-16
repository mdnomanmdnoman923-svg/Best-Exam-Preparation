import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function PageHeader({ title, subtitle, action, className, icon }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex items-start justify-between gap-4 mb-6', className)}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-bep-primary/10 border border-bep-primary/20 flex items-center justify-center text-xl">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-bep-text font-bengali">{title}</h1>
          {subtitle && (
            <p className="text-sm text-bep-text-dim mt-0.5 font-bengali">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </motion.div>
  )
}
