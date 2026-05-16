// bep-full-project/src/features/dashboard/components/SubjectCard.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Layers3,
  Sparkles,
  Star,
  Target,
  Trophy,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export interface SubjectCardProps {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  totalQuestions?: number;
  totalChapters?: number;
  totalStudents?: number;
  averageScore?: number;
  premium?: boolean;
  featured?: boolean;
  locked?: boolean;
  progress?: number;
  onClick?: (id: string) => void;
  onExplore?: (id: string) => void;
  className?: string;
}

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '').trim();
  if (![3, 6].includes(value.length)) return `rgba(6, 182, 212, ${alpha})`;

  const normalized =
    value.length === 3
      ? value
          .split('')
          .map((char) => char + char)
          .join('')
      : value;

  const int = Number.parseInt(normalized, 16);
  if (Number.isNaN(int)) return `rgba(6, 182, 212, ${alpha})`;

  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function SubjectCard({
  id,
  name,
  slug,
  description = 'Bengali-first learning with smart practice, mock exams, and AI support.',
  icon,
  color = '#06B6D4',
  totalQuestions = 0,
  totalChapters = 0,
  totalStudents = 0,
  averageScore = 0,
  premium = false,
  featured = false,
  locked = false,
  progress = 0,
  onClick,
  onExplore,
  className = '',
}: SubjectCardProps) {
  const safeProgress = Math.max(0, Math.min(100, progress));

  const glowStart = hexToRgba(color, 0.20);
  const glowMid = hexToRgba(color, 0.10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={[
        'group relative overflow-hidden rounded-[30px] border border-white/10',
        'bg-white/[0.04] shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl',
        'transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.06]',
        className,
      ].join(' ')}
    >
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(circle at top left, ${glowStart}, transparent 30%), radial-gradient(circle at bottom right, ${glowMid}, transparent 34%)`,
        }}
      />

      <div className="relative z-10">
        <div className="relative h-44 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(color, 0.26)}, ${hexToRgba(
                color,
                0.08,
              )} 45%, rgba(255,255,255,0.02) 100%)`,
            }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_30%)] opacity-60" />

          <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2">
            {premium ? <Badge variant="premium">Premium</Badge> : null}
            {featured ? <Badge variant="success">Featured</Badge> : null}
            {locked ? (
              <div className="inline-flex items-center gap-1 rounded-full border border-red-400/15 bg-red-400/10 px-3 py-1 text-[11px] font-semibold text-red-100">
                <Sparkles className="h-3.5 w-3.5" />
                Locked
              </div>
            ) : null}
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold text-white/80 backdrop-blur-xl">
                <Layers3 className="h-3.5 w-3.5" />
                {slug || 'Subject'}
              </div>

              <h2 className="line-clamp-2 text-2xl font-bold tracking-tight text-white">
                {name}
              </h2>
            </div>

            <div
              className="hidden shrink-0 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-xl sm:flex"
              style={{
                boxShadow: `0 0 0 1px ${hexToRgba(color, 0.12)}, 0 14px 40px ${hexToRgba(
                  color,
                  0.12,
                )}`,
              }}
            >
              {icon ?? <BookOpen className="h-7 w-7 text-white" />}
            </div>
          </div>
        </div>

        <div className="p-5">
          <p className="line-clamp-3 text-sm leading-7 text-white/65">
            {description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <div
              className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold"
              style={{
                borderColor: hexToRgba(color, 0.20),
                backgroundColor: hexToRgba(color, 0.10),
                color: '#EAFBFF',
              }}
            >
              <Target className="h-3.5 w-3.5" />
              {totalChapters} Chapters
            </div>

            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/75">
              <BookOpen className="h-3.5 w-3.5" />
              {totalQuestions} Questions
            </div>

            {totalStudents > 0 ? (
              <div className="inline-flex items-center gap-1 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">
                <Trophy className="h-3.5 w-3.5" />
                {totalStudents} Students
              </div>
            ) : null}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-cyan-100">
                <Star className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Avg Score
                </span>
              </div>

              <h3 className="mt-2 text-xl font-bold text-white">
                {averageScore}%
              </h3>

              <p className="mt-1 text-xs text-white/45">
                Platform performance
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-fuchsia-100">
                <Target className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Progress
                </span>
              </div>

              <h3 className="mt-2 text-xl font-bold text-white">
                {safeProgress}%
              </h3>

              <p className="mt-1 text-xs text-white/45">
                Personal learning progress
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-white/45">
                Learning Progress
              </span>
              <span className="font-bold text-cyan-100">{safeProgress}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${safeProgress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${color}, ${hexToRgba(
                    color,
                    0.72,
                  )})`,
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              fullWidth
              disabled={locked}
              leftIcon={<BookOpen className="h-4 w-4" />}
              onClick={() => onClick?.(id)}
            >
              Open Subject
            </Button>

            <Button
              fullWidth
              variant="secondary"
              rightIcon={<ArrowRight className="h-4 w-4" />}
              onClick={() => onExplore?.(id)}
            >
              Explore
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
