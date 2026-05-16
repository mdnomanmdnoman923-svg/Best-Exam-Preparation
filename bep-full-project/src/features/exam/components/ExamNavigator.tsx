// bep-full-project/src/features/exam/components/ExamNavigator.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Eye,
  FileQuestion,
  Flag,
  Sparkles,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export interface ExamNavigatorQuestion {
  id: string;
  index: number;
  answered?: boolean;
  flagged?: boolean;
  visited?: boolean;
  locked?: boolean;
}

export interface ExamNavigatorProps {
  questions: ExamNavigatorQuestion[];
  currentIndex: number;
  totalQuestions?: number;
  answeredCount?: number;
  flaggedCount?: number;
  remainingTime?: string;
  examTitle?: string;
  disabled?: boolean;
  onNavigate?: (index: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  className?: string;
}

function getQuestionStyles(
  question: ExamNavigatorQuestion,
  active: boolean,
) {
  if (question.locked) {
    return 'border-white/10 bg-white/[0.03] text-white/25 cursor-not-allowed';
  }

  if (active) {
    return 'border-cyan-400/20 bg-cyan-400/15 text-cyan-100 shadow-[0_10px_35px_rgba(6,182,212,0.20)]';
  }

  if (question.flagged) {
    return 'border-amber-400/20 bg-amber-400/10 text-amber-100';
  }

  if (question.answered) {
    return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100';
  }

  if (question.visited) {
    return 'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100';
  }

  return 'border-white/10 bg-white/[0.04] text-white/65 hover:border-cyan-400/15 hover:bg-white/[0.07] hover:text-white';
}

export default function ExamNavigator({
  questions,
  currentIndex,
  totalQuestions,
  answeredCount,
  flaggedCount,
  remainingTime,
  examTitle = 'Mock Exam Navigator',
  disabled = false,
  onNavigate,
  onPrevious,
  onNext,
  onSubmit,
  className = '',
}: ExamNavigatorProps) {
  const total =
    totalQuestions || questions.length;

  const answered =
    answeredCount ??
    questions.filter(
      (item) => item.answered,
    ).length;

  const flagged =
    flaggedCount ??
    questions.filter(
      (item) => item.flagged,
    ).length;

  const progress = useMemo(() => {
    if (!total) return 0;

    return Math.min(
      100,
      Math.round(
        (answered / total) * 100,
      ),
    );
  }, [answered, total]);

  const currentQuestion =
    currentIndex + 1;

  return (
    <div
      className={[
        'overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]',
        'shadow-[0_18px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl',
        className,
      ].join(' ')}
    >
      <div className="relative overflow-hidden border-b border-white/10 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

        <div className="relative z-10">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                <Sparkles className="h-3.5 w-3.5" />
                BEP Exam Engine
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white">
                {examTitle}
              </h2>

              <p className="mt-2 text-sm leading-7 text-white/60">
                Smart question navigation with bookmark and flag support.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                <FileQuestion className="h-4 w-4" />
                {currentQuestion}/{total}
              </div>

              {remainingTime ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/15 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-100">
                  <Clock3 className="h-4 w-4" />
                  {remainingTime}
                </div>
              ) : null}

              <Badge variant="premium">
                Live Exam
              </Badge>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-white/45">
                Completion Progress
              </span>

              <span className="font-bold text-cyan-100">
                {progress}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4">
            <div className="flex items-center gap-2 text-emerald-100">
              <CheckCircle2 className="h-4 w-4" />

              <span className="text-xs font-semibold uppercase tracking-wide">
                Answered
              </span>
            </div>

            <h3 className="mt-3 text-2xl font-bold text-white">
              {answered}
            </h3>

            <p className="mt-1 text-xs text-white/55">
              Questions completed
            </p>
          </div>

          <div className="rounded-2xl border border-amber-400/15 bg-amber-400/10 p-4">
            <div className="flex items-center gap-2 text-amber-100">
              <Flag className="h-4 w-4" />

              <span className="text-xs font-semibold uppercase tracking-wide">
                Flagged
              </span>
            </div>

            <h3 className="mt-3 text-2xl font-bold text-white">
              {flagged}
            </h3>

            <p className="mt-1 text-xs text-white/55">
              Review later
            </p>
          </div>

          <div className="rounded-2xl border border-fuchsia-400/15 bg-fuchsia-400/10 p-4">
            <div className="flex items-center gap-2 text-fuchsia-100">
              <Eye className="h-4 w-4" />

              <span className="text-xs font-semibold uppercase tracking-wide">
                Visited
              </span>
            </div>

            <h3 className="mt-3 text-2xl font-bold text-white">
              {
                questions.filter(
                  (item) =>
                    item.visited,
                ).length
              }
            </h3>

            <p className="mt-1 text-xs text-white/55">
              Seen questions
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
            <div className="flex items-center gap-2 text-cyan-100">
              <FileQuestion className="h-4 w-4" />

              <span className="text-xs font-semibold uppercase tracking-wide">
                Remaining
              </span>
            </div>

            <h3 className="mt-3 text-2xl font-bold text-white">
              {Math.max(
                0,
                total - answered,
              )}
            </h3>

            <p className="mt-1 text-xs text-white/55">
              Questions left
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Answered
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/15 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-100">
            <Flag className="h-3.5 w-3.5" />
            Flagged
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1.5 text-xs font-semibold text-fuchsia-100">
            <Eye className="h-3.5 w-3.5" />
            Visited
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-100">
            Current
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-10">
          {questions.map(
            (question, index) => {
              const active =
                index === currentIndex;

              return (
                <motion.button
                  key={question.id}
                  type="button"
                  whileTap={{
                    scale: 0.95,
                  }}
                  whileHover={{
                    y: -2,
                  }}
                  disabled={
                    disabled ||
                    question.locked
                  }
                  onClick={() =>
                    onNavigate?.(
                      index,
                    )
                  }
                  className={[
                    'relative flex aspect-square items-center justify-center border text-sm font-bold transition-all duration-300',
                    getQuestionStyles(
                      question,
                      active,
                    ),
                  ].join(' ')}
                >
                  {question.flagged ? (
                    <Flag className="absolute right-1 top-1 h-3 w-3" />
                  ) : null}

                  {question.answered &&
                  !question.flagged ? (
                    <CheckCircle2 className="absolute right-1 top-1 h-3 w-3" />
                  ) : null}

                  {index + 1}
                </motion.button>
              );
            },
          )}
        </div>
      </div>

      <div className="border-t border-white/10 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="secondary"
              disabled={
                disabled ||
                currentIndex === 0
              }
              leftIcon={
                <ArrowLeft className="h-4 w-4" />
              }
              onClick={onPrevious}
            >
              Previous
            </Button>

            <Button
              disabled={
                disabled ||
                currentIndex >=
                  total - 1
              }
              rightIcon={
                <ArrowRight className="h-4 w-4" />
              }
              onClick={onNext}
            >
              Next Question
            </Button>
          </div>

          <Button
            variant="secondary"
            disabled={disabled}
            onClick={onSubmit}
            rightIcon={
              <CheckCircle2 className="h-4 w-4" />
            }
          >
            Submit Exam
          </Button>
        </div>
      </div>
    </div>
  );
}
