import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  label?: string
  error?: string
}

export function Dropdown({ options, value, onChange, placeholder = 'বেছে নিন...', className, label, error }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className={cn('w-full space-y-1.5', className)} ref={ref}>
      {label && <label className="text-sm font-medium text-bep-text-dim font-bengali block">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className={cn(
            'input-bep flex items-center justify-between cursor-pointer',
            error && 'border-red-500/60'
          )}
        >
          <span className={cn(!selected && 'text-bep-muted')}>{selected?.label ?? placeholder}</span>
          <ChevronDown size={16} className={cn('transition-transform text-bep-muted', open && 'rotate-180')} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-1 z-[100] bg-bep-card border border-bep-border rounded-xl shadow-card overflow-hidden"
            >
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm font-bengali transition-colors hover:bg-bep-surface',
                    opt.value === value ? 'text-bep-primary bg-bep-primary/5' : 'text-bep-text-dim'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="text-xs text-red-400 font-bengali">{error}</p>}
    </div>
  )
}
