// src/components/ui/Tabs.tsx

import React from 'react';
import { cn } from '@/lib/cn';

export type TabItem = {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  fullWidth?: boolean;
  compact?: boolean;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      items,
      value,
      onValueChange,
      fullWidth = false,
      compact = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          className={cn(
            'flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-2xl',
            fullWidth && 'w-full',
          )}
        >
          {items.map((item) => {
            const active = value === item.value;

            return (
              <button
                key={item.value}
                type="button"
                disabled={item.disabled}
                onClick={() => onValueChange(item.value)}
                className={cn(
                  'inline-flex min-w-0 items-center justify-center gap-2 rounded-xl px-4 font-medium transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-cyan-400/25',
                  compact ? 'h-10 text-sm' : 'h-11 text-sm',
                  fullWidth && 'flex-1',
                  active
                    ? 'bg-white/12 text-white shadow-lg shadow-black/20'
                    : 'text-white/60 hover:bg-white/8 hover:text-white',
                  item.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
                )}
                aria-pressed={active}
                aria-disabled={item.disabled}
              >
                {item.icon ? <span className="shrink-0">{item.icon}</span> : null}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);

Tabs.displayName = 'Tabs';

export default Tabs;
