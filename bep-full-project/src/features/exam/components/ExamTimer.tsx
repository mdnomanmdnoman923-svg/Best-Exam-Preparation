// bep-full-project/src/features/exam/components/ExamTimer.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlarmClock,
  Clock3,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  TimerReset,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export interface ExamTimerProps {
  initialSeconds?: number;
  remainingSeconds?: number;
  running?: boolean;
  paused?: boolean;
  disabled?: boolean;
  title?: string;
  subtitle?: string;
  showControls?: boolean;
  showProgress?: boolean;
  autoStart?: boolean;
  onTick?: (remainingSeconds: number) => void;
  onPause?: () => void;
  onResume?: () => void;
  onReset?: () => void;
  onExpire?: () => void;
  className?: string;
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function formatTime(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}`;
}

function getTimerAccent(percent: number) {
  if (percent <= 15) {
    return {
      bar: 'from-red-500 to-orange-500',
      text: 'text-red-100',
      ring: 'border-red-400/15 bg-red-400/10',
      label: 'Urgent',
    };
  }

  if (percent <= 40) {
    return {
      bar: 'from-amber-400 to-orange-500',
      text: 'text-amber-100',
      ring: 'border-amber-400/15 bg-amber-400/10',
      label: 'Warning',
    };
  }

  return {
    bar: 'from-cyan-400 to-fuchsia-500',
    text: 'text-cyan-100',
    ring: 'border-cyan-400/15 bg-cyan-400/10',
    label: 'Active',
  };
}

export default function ExamTimer({
  initialSeconds = 0,
  remainingSeconds,
  running = false,
  paused = false,
  disabled = false,
  title = 'Exam Timer',
  subtitle = 'সময় শেষ হওয়ার আগে exam complete করুন',
  showControls = true,
  showProgress = true,
  autoStart = false,
  onTick,
  onPause,
  onResume,
  onReset,
  onExpire,
  className = '',
}: ExamTimerProps) {
  const [internalSeconds, setInternalSeconds] = useState(
    typeof remainingSeconds === 'number' ? remainingSeconds : initialSeconds,
  );
  const [isRunning, setIsRunning] = useState(autoStart || running);
  const [isPaused, setIsPaused] = useState(paused);

  const currentSeconds =
    typeof remainingSeconds === 'number' ? remainingSeconds : internalSeconds;

  useEffect(() => {
    if (typeof remainingSeconds === 'number') {
      setInternalSeconds(remainingSeconds);
    }
  }, [remainingSeconds]);

  useEffect(() => {
    setIsRunning(running || autoStart);
  }, [autoStart, running]);

  useEffect(() => {
    setIsPaused(paused);
  }, [paused]);

  useEffect(() => {
    if (!isRunning || isPaused || disabled) return;

    const timer = window.setInterval(() => {
      setInternalSeconds((prev) => {
        const next = Math.max(0, prev - 1);
        onTick?.(next);

        if (next === 0) {
          window.clearInterval(timer);
          setIsRunning(false);
          onExpire?.();
        }

        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [disabled, isPaused, isRunning, onExpire, onTick]);

  const total = Math.max(initialSeconds, 1);
  const safeRemaining = Math.max(0, currentSeconds);
  const elapsed = Math.max(0, total - safeRemaining);
  const progress = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));

  const accent = getTimerAccent(100 - progress);
  const formatted = useMemo(() => formatTime(safeRemaining), [safeRemaining]);

  const handlePauseResume = () => {
    if (disabled) return;

    if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
      onResume?.();
    } else {
      setIsPaused(true);
      setIsRunning(false);
      onPause?.();
    }
  };

  const handleReset = () => {
    if (disabled) return;

    const next = initialSeconds;
    setInternalSeconds(next);
    setIsPaused(false);
    setIsRunning(autoStart || running);
    onReset?.();
    onTick?.(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={[
        'overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]',
        'shadow-[0_18px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl',
        className,
      ].join(' ')}
    >
      <div className="relative overflow-hidden border-b border-white/10 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={[
                'flex h-14 w-14 items-center justify-center rounded-3xl border',
                accent.ring,
                'shadow-lg',
              ].join(' ')}
            >
              <AlarmClock className={['h-6 w-6', accent.text].join(' ')} />
            </div>

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                <Sparkles className="h-3.5 w-3.5" />
                BEP Exam Engine
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                {title}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={safeRemaining <= 300 ? 'danger' : 'premium'}>
              {safeRemaining <= 300 ? 'Time Critical' : 'Timer Active'}
            </Badge>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/75">
              <Clock3 className="h-4 w-4 text-cyan-100" />
              {formatted}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-cyan-100">
              <Clock3 className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Remaining
              </span>
            </div>
            <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
              {formatted}
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/55">
              আপনার বাকি সময়
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-emerald-100">
              <TimerReset className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Progress
              </span>
            </div>
            <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
              {progress}%
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/55">
              {accent.label} pacing
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-fuchsia-100">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Status
              </span>
            </div>
            <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
              {isPaused ? 'Paused' : isRunning ? 'Live' : 'Ready'}
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/55">
              {isPaused ? 'সময় থেমে আছে' : 'সময় চলছে'}
            </p>
          </div>
        </div>
      </div>

      {showProgress ? (
        <div className="border-b border-white/10 p-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-white/45">
              Time Used
            </span>
            <span className="font-bold text-cyan-100">{progress}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={[
                'h-full rounded-full bg-gradient-to-r',
                accent.bar,
              ].join(' ')}
            />
          </div>
        </div>
      ) : null}

      <div className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-sm text-white/55">
            <div
              className={[
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold',
                accent.ring,
                accent.text,
              ].join(' ')}
            >
              {isPaused ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              {isPaused ? 'Paused' : 'Running'}
            </div>

            <span>
              {safeRemaining > 0
                ? 'সময় শেষ হওয়ার আগে উত্তর জমা দিন'
                : 'সময় শেষ হয়ে গেছে'}
            </span>
          </div>

          {showControls ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                onClick={handlePauseResume}
                disabled={disabled || safeRemaining === 0}
                leftIcon={
                  isPaused ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )
                }
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>

              <Button
                variant="ghost"
                onClick={handleReset}
                disabled={disabled}
                leftIcon={<RotateCcw className="h-4 w-4" />}
              >
                Reset
              </Button>
            </div>
          ) : null}
        </div>

        {safeRemaining === 0 ? (
          <div className="mt-5 rounded-3xl border border-red-400/15 bg-red-400/10 p-4 text-sm text-red-100">
            সময় শেষ হয়েছে। এখনই exam submit করুন।
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
