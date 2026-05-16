import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-bep-bg flex flex-col items-center justify-center z-50">
      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-bep-primary/10 rounded-full blur-3xl animate-orb" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-bep-accent/8 rounded-full blur-3xl animate-orb delay-300" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center gap-6"
      >
        {/* Logo mark */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-primary-gradient flex items-center justify-center shadow-glow-md animate-pulse-glow">
            <span className="text-3xl font-bold text-white font-display">BEP</span>
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-primary-gradient opacity-30 blur-md -z-10" />
        </div>

        {/* Spinner */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-bep-primary"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <p className="text-bep-text-dim text-sm font-bengali">
          লোড হচ্ছে...
        </p>
      </motion.div>
    </div>
  )
}
