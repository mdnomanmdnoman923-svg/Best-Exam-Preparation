// bep-full-project/src/features/exam/components/ExamQuestionView.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Crown,
  Flag,
  HelpCircle,
  Info,
  Lightbulb,
  Lock,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import BookmarkButton from './BookmarkButton';

export type ExamQuestionType = 'mcq' | 'cq' | 'sq';

export interface ExamQuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface ExamQuestionData {
  id: string;
  type: ExamQuestionType;
  question: string;
  options?: ExamQuestionOption[];
  answer?: string;
  explanation?: string;
  hint?: string;
  subject?: string;
  chapter?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  premium?: boolean;
  locked?: boolean;
  bookmarked?: boolean;
  flagged?: boolean;
  points?: number;
  duration?: number;
  imageUrl?: string;
}

export interface ExamQuestionViewProps {
  question: ExamQuestionData;
  index?: number;
  totalQuestions?: number;
  selectedAnswer?: string;
  subjectiveAnswer?: string;
  submitting?: boolean;
  reviewed?: boolean;
  showAnswer?: boolean;
  showExplanation?: boolean;
  timeSpent?: string;
  onSelectAnswer?: (questionId: string, answer: string) => void;
  onSubjectiveAnswerChange?: (questionId: string, value: string) => void;
  onToggleBookmark?: (questionId: string, nextState: boolean) => Promise<void> | void;
  onToggleFlag?: (questionId: string) => void;
  onRequestHint?: (questionId: string) => void;
  onCheckAnswer?: (questionId: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  className?: string;
}

function difficultyBadge(
  difficulty?: ExamQuestionData['difficulty'],
) {
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

export default function ExamQuestionView({
  question,
  index,
  totalQuestions,
  selectedAnswer,
  subjectiveAnswer,
  submitting = false,
  reviewed = false,
  showAnswer = false,
  showExplanation = false,
  timeSpent,
  onSelectAnswer,
  onSubjectiveAnswerChange,
  onToggleBookmark,
  onToggleFlag,
  onRequestHint,
  onCheckAnswer,
  onNext,
  onPrevious,
  className = '',
}: ExamQuestionViewProps) {
  const [localSubjective, setLocalSubjective] = useState(subjectiveAnswer || '');

  const answeredState = useMemo(() => {
    if (question.type !== 'mcq') return false;
    return Boolean(selectedAnswer);
  }, [question.type, selectedAnswer]);

  const diffMeta = difficultyBadge(question.difficulty);

  const isCorrect = useMemo(() => {
    if (!showAnswer || question.type !== 'mcq' || !question.answer) return null;
    return selectedAnswer === question.answer;
  }, [question.answer, question.type, selectedAnswer, showAnswer]);

  const handleSubjectiveChange = (value: string) => {
    setLocalSubjective(value);
    onSubjectiveAnswerChange?.(question.id, value);
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

        <div className="relative z-10">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Exam Question
                </div>

                {question.premium ? (
                  <Badge variant="premium">
                    <Crown className="mr-1 h-3.5 w-3.5" />
                    Premium
                  </Badge>
                ) : null}

                {question.locked ? (
                  <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/60">
                    <Lock className="h-3.5 w-3.5" />
                    Locked
                  </div>
                ) : null}

                <div
                  className={[
                    'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold',
                    diffMeta.className,
                  ].join(' ')}
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  {diffMeta.label}
                </div>

                {question.flagged ? (
                  <div className="inline-flex items-center gap-1 rounded-full border border-amber-400/15 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold text-amber-100">
                    <Flag className="h-3.5 w-3.5" />
                    Flagged
                  </div>
                ) : null}
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                {index != null && totalQuestions != null ? (
                  <span className="mr-2 text-cyan-100">
                    Q{index + 1}/{totalQuestions}
                  </span>
                ) : null}
                {question.question}
              </h2>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/55">
                {question.subject ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {question.subject}
                  </span>
                ) : null}

                {question.chapter ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                    <Info className="h-3.5 w-3.5" />
                    {question.chapter}
                  </span>
                ) : null}

                {typeof question.points === 'number' ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1.5 text-cyan-100">
                    <BrainCircuit className="h-3.5 w-3.5" />
                    {question.points} pts
                  </span>
                ) : null}

                {typeof question.duration === 'number' ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/15 bg-amber-400/10 px-3 py-1.5 text-amber-100">
                    <Clock3 className="h-3.5 w-3.5" />
                    {question.duration} min
                  </span>
                ) : null}

                {timeSpent ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1.5 text-fuchsia-100">
                    <Clock3 className="h-3.5 w-3.5" />
                    Spent {timeSpent}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <BookmarkButton
                questionId={question.id}
                bookmarked={question.bookmarked}
                onToggle={onToggleBookmark}
              />

              <Button
                type="button"
                variant="secondary"
                onClick={() => onToggleFlag?.(question.id)}
                leftIcon={<Flag className="h-4 w-4" />}
                className={question.flagged ? 'border-amber-400/20 bg-amber-400/10 text-amber-100' : ''}
              >
                {question.flagged ? 'Flagged' : 'Flag'}
              </Button>
            </div>
          </div>

          {question.hint ? (
            <div className="mt-5 rounded-3xl border border-cyan-400/15 bg-cyan-400/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-cyan-100">
                <HelpCircle className="h-4 w-4" />
                <span className="text-sm font-semibold">Hint available</span>
              </div>
              <p className="text-sm leading-7 text-white/75">{question.hint}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-6">
        {question.imageUrl ? (
          <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
            <img
              src={question.imageUrl}
              alt={question.question}
              className="h-64 w-full object-cover"
            />
          </div>
        ) : null}

        {question.type === 'mcq' ? (
          <div className="space-y-3">
            {(question.options || []).map((option, optionIndex) => {
              const isSelected = selectedAnswer === option.value;
              const revealAnswer = showAnswer && question.answer;
              const isCorrectAnswer = revealAnswer ? option.value === question.answer : false;
              const isWrongSelection = revealAnswer && isSelected && question.answer !== selectedAnswer;

              return (
                <motion.button
                  key={option.id}
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={question.locked}
                  onClick={() => onSelectAnswer?.(question.id, option.value)}
                  className={[
                    'group relative w-full overflow-hidden rounded-3xl border px-5 py-4 text-left transition-all duration-300',
                    'backdrop-blur-xl',
                    question.locked
                      ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-white/30'
                      : '',
                    isCorrectAnswer
                      ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                      : isWrongSelection
                        ? 'border-red-400/20 bg-red-400/10 text-red-100'
                        : isSelected
                          ? 'border-cyan-400/20 bg-cyan-400/15 text-cyan-100 shadow-[0_10px_35px_rgba(6,182,212,0.18)]'
                          : 'border-white/10 bg-white/[0.04] text-white/75 hover:border-cyan-400/15 hover:bg-white/[0.06] hover:text-white',
                  ].join(' ')}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                  <div className="relative z-10 flex items-center gap-4">
                    <div
                      className={[
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-bold transition',
                        isCorrectAnswer
                          ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                          : isWrongSelection
                            ? 'border-red-400/20 bg-red-400/10 text-red-100'
                            : isSelected
                              ? 'border-cyan-400/20 bg-cyan-400/15 text-cyan-100'
                              : 'border-white/10 bg-white/[0.04] text-white/55',
                      ].join(' ')}
                    >
                      {option.label}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-7">
                        {option.value}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {revealAnswer && isCorrectAnswer ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                      ) : null}

                      {revealAnswer && isWrongSelection ? (
                        <AlertCircle className="h-5 w-5 text-red-200" />
                      ) : null}

                      {isSelected && !revealAnswer ? (
                        <div className="h-3 w-3 rounded-full bg-cyan-300" />
                      ) : null}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <label className="mb-3 block text-sm font-semibold text-white/85">
                লিখিত উত্তর
              </label>
              <textarea
                rows={10}
                value={localSubjective}
                onChange={(e) => handleSubjectiveChange(e.target.value)}
                placeholder="আপনার উত্তর লিখুন..."
                className="w-full rounded-2xl border border-white/10 bg-[#08111F]/70 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/15"
              />
            </div>

            {showAnswer && question.answer ? (
              <div className="rounded-3xl border border-emerald-400/15 bg-emerald-400/10 p-5">
                <div className="mb-2 flex items-center gap-2 text-emerald-100">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-semibold">Model answer</span>
                </div>
                <p className="text-sm leading-7 text-white/75">{question.answer}</p>
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={() => onCheckAnswer?.(question.id)}
            loading={submitting}
            disabled={question.locked}
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            {reviewed ? 'Reviewed' : 'Check Answer'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => onRequestHint?.(question.id)}
            disabled={question.locked}
            leftIcon={<Lightbulb className="h-4 w-4" />}
          >
            Get Hint
          </Button>

          {onPrevious ? (
            <Button type="button" variant="ghost" onClick={onPrevious}>
              Previous
            </Button>
          ) : null}

          {onNext ? (
            <Button type="button" variant="ghost" onClick={onNext}>
              Next
            </Button>
          ) : null}
        </div>

        {showAnswer || showExplanation ? (
          <div className="mt-6 grid gap-4">
            {question.type === 'mcq' && isCorrect !== null ? (
              <div
                className={[
                  'rounded-3xl border p-5',
                  isCorrect
                    ? 'border-emerald-400/15 bg-emerald-400/10'
                    : 'border-red-400/15 bg-red-400/10',
                ].join(' ')}
              >
                <div className="mb-2 flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-100" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-100" />
                  )}
                  <span className="text-sm font-semibold text-white">
                    {isCorrect ? 'Correct answer' : 'Incorrect answer'}
                  </span>
                </div>

                <p className="text-sm leading-7 text-white/75">
                  {question.answer
                    ? `Answer: ${question.answer}`
                    : 'No answer available.'}
                </p>
              </div>
            ) : null}

            {question.explanation ? (
              <div className="rounded-3xl border border-cyan-400/15 bg-cyan-400/10 p-5">
                <div className="mb-2 flex items-center gap-2 text-cyan-100">
                  <BrainCircuit className="h-4 w-4" />
                  <span className="text-sm font-semibold">Explanation</span>
                </div>
                <p className="text-sm leading-7 text-white/75">
                  {question.explanation}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {!answeredState && question.type === 'mcq' ? (
          <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-white/55">
            Tip: আপনি answer select করে পরে “Check Answer” চাপতে পারেন।
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
