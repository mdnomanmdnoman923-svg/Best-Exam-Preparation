// bep-full-project/src/features/chapters/components/ChapterCard.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Flame,
  Layers3,
  Lock,
  PlayCircle,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export interface ChapterCardProps {
  id: string;
  title: string;
  subject: string;
  description?: string;
  thumbnail?: string;
  progress?: number;
  totalQuestions?: number;
  completedQuestions?: number;
  estimatedMinutes?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  premium?: boolean;
  locked?: boolean;
  featured?: boolean;
  aiSupported?: boolean;
  streak?: number;
  rating?: number;
  onClick?: (id: string) => void;
  onPractice?: (id: string) => void;
  className?: string;
}

function getDifficultyStyle(
  difficulty?: ChapterCardProps['difficulty'],
) {
  switch (difficulty) {
    case 'easy':
      return {
        label: 'Easy',
        className:
          'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
      };

    case 'medium':
      return {
        label: 'Medium',
        className:
          'border-amber-400/15 bg-amber-400/10 text-amber-100',
      };

    case 'hard':
      return {
        label: 'Hard',
        className:
          'border-red-400/15 bg-red-400/10 text-red-100',
      };

    default:
      return {
        label: 'General',
        className:
          'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
      };
  }
}

export default function ChapterCard({
  id,
  title,
  subject,
  description = 'Smart Bengali-first chapter learning experience with AI assistance.',
  thumbnail,
  progress = 0,
  totalQuestions = 0,
  completedQuestions = 0,
  estimatedMinutes = 0,
  difficulty = 'medium',
  premium = false,
  locked = false,
  featured = false,
  aiSupported = true,
  streak = 0,
  rating = 4.8,
  onClick,
  onPractice,
  className = '',
}: ChapterCardProps) {
  const difficultyMeta =
    getDifficultyStyle(difficulty);

  const safeProgress = Math.min(
    Math.max(progress, 0),
    100,
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.28,
      }}
      whileHover={{
        y: -4,
      }}
      className={[
        'group relative overflow-hidden rounded-[30px] border border-white/10',
        'bg-white/[0.04] shadow-[0_18px_60px_rgba(0,0,0,0.30)] backdrop-blur-2xl',
        'transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.06]',
        className,
      ].join(' ')}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)] opacity-80" />

      <div className="relative z-10">
        <div className="relative overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-52 items-center justify-center bg-gradient-to-br from-cyan-500/15 to-fuchsia-500/15">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05] text-cyan-100">
                <BookOpen className="h-10 w-10" />
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/20 to-transparent" />

          <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2">
            {premium ? (
              <Badge variant="premium">
                Premium
              </Badge>
            ) : null}

            {featured ? (
              <Badge variant="success">
                Featured
              </Badge>
            ) : null}

            {locked ? (
              <div className="inline-flex items-center gap-1 rounded-full border border-red-400/15 bg-red-400/10 px-3 py-1 text-[11px] font-semibold text-red-100">
                <Lock className="h-3.5 w-3.5" />
                Locked
              </div>
            ) : null}
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold text-white/80 backdrop-blur-xl">
                <Layers3 className="h-3.5 w-3.5" />
                {subject}
              </div>

              <h2 className="line-clamp-2 text-2xl font-bold tracking-tight text-white">
                {title}
              </h2>
            </div>

            <div className="hidden shrink-0 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-xl sm:flex">
              <div className="flex items-center gap-1 text-sm font-semibold text-yellow-200">
                <Star className="h-4 w-4 fill-yellow-200" />
                {rating.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <p className="line-clamp-3 text-sm leading-7 text-white/65">
            {description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <div
              className={[
                'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold',
                difficultyMeta.className,
              ].join(' ')}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {difficultyMeta.label}
            </div>

            {aiSupported ? (
              <div className="inline-flex items-center gap-1 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-[11px] font-semibold text-fuchsia-100">
                <Brain className="h-3.5 w-3.5" />
                AI Support
              </div>
            ) : null}

            {streak > 0 ? (
              <div className="inline-flex items-center gap-1 rounded-full border border-orange-400/15 bg-orange-400/10 px-3 py-1 text-[11px] font-semibold text-orange-100">
                <Flame className="h-3.5 w-3.5" />
                {streak} Day Streak
              </div>
            ) : null}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-cyan-100">
                <FileQuestion className="h-4 w-4" />

                <span className="text-xs font-semibold uppercase tracking-wide">
                  Questions
                </span>
              </div>

              <h3 className="mt-2 text-xl font-bold text-white">
                {totalQuestions}
              </h3>

              <p className="mt-1 text-xs text-white/45">
                {completedQuestions} completed
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-fuchsia-100">
                <Clock3 className="h-4 w-4" />

                <span className="text-xs font-semibold uppercase tracking-wide">
                  Duration
                </span>
              </div>

              <h3 className="mt-2 text-xl font-bold text-white">
                {estimatedMinutes}m
              </h3>

              <p className="mt-1 text-xs text-white/45">
                Estimated learning
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-white/45">
                Progress
              </span>

              <span className="font-bold text-cyan-100">
                {safeProgress}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${safeProgress}%`,
                }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              fullWidth
              disabled={locked}
              leftIcon={
                <PlayCircle className="h-4 w-4" />
              }
              onClick={() => onPractice?.(id)}
            >
              Practice Now
            </Button>

            <Button
              fullWidth
              variant="secondary"
              rightIcon={
                <ArrowRight className="h-4 w-4" />
              }
              onClick={() => onClick?.(id)}
            >
              View Details
            </Button>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Trophy className="h-4 w-4 text-yellow-200" />
              Smart leaderboard enabled
            </div>

            {safeProgress >= 100 ? (
              <div className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-100">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </div>
            ) : (
              <span className="text-sm font-medium text-white/45">
                Keep learning
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
