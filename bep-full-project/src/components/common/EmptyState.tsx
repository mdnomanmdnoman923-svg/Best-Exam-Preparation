import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon = '📭', title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      <div className="text-5xl mb-4 animate-float">{icon}</div>
      <h3 className="text-lg font-semibold text-bep-text mb-2 font-bengali">{title}</h3>
      {description && (
        <p className="text-bep-text-dim text-sm max-w-sm font-bengali">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
}

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'কিছু একটা ভুল হয়েছে',
  message = 'দয়া করে আবার চেষ্টা করুন',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      <div className="text-5xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-bep-danger mb-2 font-bengali">{title}</h3>
      <p className="text-bep-text-dim text-sm max-w-sm font-bengali">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 btn-primary text-sm px-5 py-2.5"
        >
          আবার চেষ্টা করুন
        </button>
      )}
    </motion.div>
  )
}
