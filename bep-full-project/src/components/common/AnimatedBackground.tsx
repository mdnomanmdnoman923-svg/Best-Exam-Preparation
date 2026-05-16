import { memo } from 'react'
import { cn } from '@/lib/cn'

interface AnimatedBackgroundProps {
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}

export const AnimatedBackground = memo(function AnimatedBackground({
  className,
  intensity = 'medium',
}: AnimatedBackgroundProps) {
  const opacity = { low: 'opacity-30', medium: 'opacity-60', high: 'opacity-100' }[intensity]

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {/* Grid pattern */}
      <div
        className={cn('absolute inset-0', opacity)}
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Primary orb */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full animate-orb"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Accent orb */}
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full animate-orb delay-300"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
          animationDelay: '3s',
        }}
      />

      {/* Center subtle glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px]"
        style={{
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.04) 0%, transparent 60%)',
        }}
      />
    </div>
  )
})
