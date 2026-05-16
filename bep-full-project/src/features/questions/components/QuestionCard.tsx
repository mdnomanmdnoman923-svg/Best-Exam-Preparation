// bep-full-project/src/features/questions/components/QuestionCard.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Crown,
  Eye,
  Flag,
  Layers3,
  Lightbulb,
  Lock,
  Sparkles,
  Star,
  Trophy,
  Wand2,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export type QuestionType = 'mcq' | 'sq' | 'cq';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionStatus = 'draft' | 'published' | 'archived';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  isCorrect?: boolean;
}

export interface QuestionCardProps {
  id: string;
  subject?: string;
  chapter?: string;
  chapterName?: string;
  title?: string;
  question: string;
  type: QuestionType;
  difficulty?: QuestionDifficulty;
  status?: QuestionStatus;
  points?: number;
  premium?: boolean;
  locked?: boolean;
  featured?: boolean;
  bookmarked?: boolean;
  flagged?: boolean;
  imageUrl?: string;
  hint?: string;
  explanation?: string;
  options?: QuestionOption[];
  correctAnswer?: string;
  answerKey?: string;
  tags?: string[];
  order?: number;
  attemptCount?: number;
  correctRate?: number;
  estimatedMinutes?: number;
  createdAt?: string;
  updatedAt?: string;
  onOpen?: (id: string) => void;
  onPractice?: (id: string) => void;
  onBookmark?: (id: string, nextState: boolean) => void;
  onFlag?: (id: string, nextState: boolean) => void;
  onPreviewHint?: (id: string) => void;
  className?: string;
}

function getDifficultyMeta(difficulty: QuestionDifficulty = 'medium') {
  switch (difficulty) {
    case 'easy':
      return {
        label: 'Easy',
        className: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
      };
    case 'hard':
      return {
        label: 'Hard',
        className: 'border-red-400/15 bg-red-400/10 text-red-100',
      };
    case 'medium':
    default:
      return {
        label: 'Medium',
        className: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
      };
  }
}

function getTypeLabel(type: QuestionType) {
  switch (type) {
    case 'mcq':
      return 'MCQ';
    case 'sq':
      return 'SQ';
    case 'cq':
      return 'CQ';
    default:
      return 'Question';
  }
}

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function QuestionCard({
  id,
  subject,
  chapter,
  chapterName,
  title,
  question,
  type,
  difficulty = 'medium',
  status = 'draft',
  points = 1,
  premium = false,
  locked = false,
  featured = false,
  bookmarked = false,
  flagged = false,
  imageUrl,
  hint,
  explanation,
  options = [],
  correctAnswer,
  answerKey,
  tags = [],
  order,
  attemptCount = 0,
  correctRate = 0,
  estimatedMinutes = 0,
  createdAt,
  updatedAt,
  onOpen,
  onPractice,
  onBookmark,
  onFlag,
  onPreviewHint,
  className = '',
}: QuestionCardProps) {
  const difficultyMeta = getDifficultyMeta(difficulty);
  const typeLabel = getTypeLabel(type);

  const safeCorrectRate = useMemo(
    () => Math.max(0, Math.min(100, correctRate || 0)),
    [correctRate],
  );

  const resolvedAnswer = correctAnswer || answerKey || '';
  const safeAttemptCount = Math.max(0, attemptCount || 0);
  const safeEstimatedMinutes = Math.max(0, estimatedMinutes || 0);

  return (
    <motion.article
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_30%)] opacity-80" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="premium">{typeLabel}</Badge>

              <div
                className={[
                  'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold',
                  difficultyMeta.className,
                ].join(' ')}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {difficultyMeta.label}
              </div>

              {premium ? <Badge variant="premium">Premium</Badge> : null}

              {featured ? <Badge variant="success">Featured</Badge> : null}

              {locked ? (
                <div className="inline-flex items-center gap-1 rounded-full border border-red-400/15 bg-red-400/10 px-3 py-1 text-[11px] font-semibold text-red-100">
                  <Lock className="h-3.5 w-3.5" />
                  Locked
                </div>
              ) : null}

              {status !== 'published' ? (
                <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/55">
                  <Eye className="h-3.5 w-3.5" />
                  {status}
                </div>
              ) : null}
            </div>

            <h3 className="line-clamp-2 text-2xl font-bold tracking-tight text-white transition group-hover:text-cyan-100">
              {title || question}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/55">
              {subject ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                  <Layers3 className="h-3.5 w-3.5" />
                  {subject}
                </span>
              ) : null}

              {chapter || chapterName ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                  <CircleHelp className="h-3.5 w-3.5" />
                  {chapterName || chapter || 'Chapter'}
                </span>
              ) : null}

              {typeof points === 'number' ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1.5 text-cyan-100">
                  <Trophy className="h-3.5 w-3.5" />
                  {points} pts
                </span>
              ) : null}

              {safeEstimatedMinutes > 0 ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/15 bg-amber-400/10 px-3 py-1.5 text-amber-100">
                  <Clock3 className="h-3.5 w-3.5" />
                  {safeEstimatedMinutes} min
                </span>
              ) : null}

              {typeof order === 'number' ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                  <Wand2 className="h-3.5 w-3.5" />
                  Order #{order}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {onBookmark ? (
              <button
                type="button"
                onClick={() => onBookmark(id, !bookmarked)}
                className={[
                  'flex h-10 w-10 items-center justify-center rounded-2xl border transition',
                  bookmarked
                    ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                    : 'border-white/10 bg-white/[0.04] text-white/55 hover:border-cyan-400/15 hover:bg-white/[0.06] hover:text-white',
                ].join(' ')}
                aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <Bookmark className={bookmarked ? 'h-4 w-4 fill-current' : 'h-4 w-4'} />
              </button>
            ) : null}

            {onFlag ? (
              <button
                type="button"
                onClick={() => onFlag(id, !flagged)}
                className={[
                  'flex h-10 w-10 items-center justify-center rounded-2xl border transition',
                  flagged
                    ? 'border-amber-400/20 bg-amber-400/10 text-amber-100'
                    : 'border-white/10 bg-white/[0.04] text-white/55 hover:border-amber-400/15 hover:bg-white/[0.06] hover:text-white',
                ].join(' ')}
                aria-label={flagged ? 'Unflag question' : 'Flag question'}
              >
                <Flag className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="px-5 py-5">
          <button
            type="button"
            onClick={() => onOpen?.(id)}
            className="block w-full text-left"
          >
            <p className="line-clamp-4 text-sm leading-7 text-white/70">
              {question}
            </p>
          </button>

          {imageUrl ? (
            <button
              type="button"
              onClick={() => onOpen?.(id)}
              className="mt-5 block w-full overflow-hidden rounded-3xl border border-white/10 bg-black/20"
            >
              <img
                src={imageUrl}
                alt={title || question}
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            </button>
          ) : null}

          {options.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {options.slice(0, 4).map((option) => (
                <div
                  key={option.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70"
                >
                  <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-xs font-bold text-cyan-100">
                    {option.label}
                  </span>
                  <span>{option.value}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/65"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {tag}
              </span>
            ))}

            {tags.length > 5 ? (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/55">
                +{tags.length - 5} more
              </span>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-cyan-100">
                <Trophy className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Accuracy
                </span>
              </div>
              <h4 className="mt-2 text-2xl font-bold text-white">
                {safeCorrectRate}%
              </h4>
              <p className="mt-1 text-xs text-white/45">Success rate</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-emerald-100">
                <Eye className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Attempts
                </span>
              </div>
              <h4 className="mt-2 text-2xl font-bold text-white">
                {safeAttemptCount}
              </h4>
              <p className="mt-1 text-xs text-white/45">Practice count</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-fuchsia-100">
                <Lightbulb className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Answer
                </span>
              </div>
              <h4 className="mt-2 truncate text-2xl font-bold text-white">
                {resolvedAnswer || '--'}
              </h4>
              <p className="mt-1 text-xs text-white/45">Correct answer key</p>
            </div>
          </div>

          {hint || explanation ? (
            <div className="mt-5 rounded-3xl border border-white/10 bg-[#08111F]/70 p-5">
              <div className="mb-3 flex items-center gap-2 text-cyan-100">
                <Lightbulb className="h-4 w-4" />
                <span className="text-sm font-semibold">Learning support</span>
              </div>

              <div className="space-y-3 text-sm leading-7 text-white/65">
                {hint ? (
                  <p>
                    <span className="font-semibold text-white">Hint:</span> {hint}
                  </p>
                ) : null}

                {explanation ? (
                  <p>
                    <span className="font-semibold text-white">Explanation:</span> {explanation}
                  </p>
                ) : null}
              </div>

              {onPreviewHint ? (
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => onPreviewHint(id)}
                    leftIcon={<Lightbulb className="h-4 w-4" />}
                  >
                    Preview hint
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
              {createdAt ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  Created {formatDate(createdAt)}
                </span>
              ) : null}

              {updatedAt ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                  <ArrowRight className="h-3.5 w-3.5" />
                  Updated {formatDate(updatedAt)}
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => onOpen?.(id)}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                View details
              </Button>

              <Button
                onClick={() => onPractice?.(id)}
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
              >
                Practice
              </Button>

              {onPreviewHint && hint ? (
                <Button
                  variant="ghost"
                  onClick={() => onPreviewHint(id)}
                  leftIcon={<Lightbulb className="h-4 w-4" />}
                >
                  Hint
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
