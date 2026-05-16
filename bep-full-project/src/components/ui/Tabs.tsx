import { createContext, useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface TabsContextValue {
  value: string
  onChange: (val: string) => void
}

const TabsContext = createContext<TabsContextValue>({ value: '', onChange: () => {} })

interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (val: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue)
  const active = value ?? internal
  const handleChange = (val: string) => {
    setInternal(val)
    onValueChange?.(val)
  }
  return (
    <TabsContext.Provider value={{ value: active, onChange: handleChange }}>
      <div className={cn('', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        'flex gap-1 bg-bep-surface border border-bep-border rounded-xl p-1',
        className
      )}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { value: active, onChange } = useContext(TabsContext)
  const isActive = active === value
  return (
    <button
      onClick={() => onChange(value)}
      className={cn(
        'relative flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors font-bengali',
        isActive ? 'text-bep-text' : 'text-bep-text-dim hover:text-bep-text',
        className
      )}
    >
      {isActive && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute inset-0 bg-bep-card border border-bep-border rounded-lg -z-10"
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      )}
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { value: active } = useContext(TabsContext)
  if (active !== value) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
