// src/features/practice/components/PracticeEngine.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Flag,
  Lightbulb,
  Loader2,
  RotateCcw,
  Sparkles,
  Star,
  TimerReset,
  Trophy,
  Wand2,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';

export type PracticeQuestionType = 'mcq' | 'cq' | 'sq';

export type PracticeDifficulty = 'easy' | 'medium' | 'hard';

export interface PracticeOption {
  id: string;
  label: string;
  value: string;
}

export interface PracticeQuestion {
  id: string;
  type: PracticeQuestionType;
  question: string;
  options?: PracticeOption[];
  answer?: string;
  explanation?: string;
  hint?: string;
  subject?: string;
  chapter?: string;
  difficulty?: PracticeDifficulty;
  premium?: boolean;
  locked?: boolean;
  bookmarked?: boolean;
  flagged?: boolean;
  points?: number;
  imageUrl?: string;
  tags?: string[];
}

export interface PracticeEngineResult {
  questionId: string;
  answer: string;
  correct: boolean | null;
  skipped: boolean;
  submittedAt: string;
}

export interface PracticeEngineProps {
  questions: PracticeQuestion[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  submitting?: boolean;
  autoStartTimer?: boolean;
  initialSeconds?: number;
  showTimer?: boolean;
  showProgress?: boolean;
  allowBookmark?: boolean;
  allowFlag?: boolean;
  allowHints?: boolean;
  showExplanationAfterSubmit?: boolean;
  onFinish?: (results: PracticeEngineResult[]) => Promise<void> | void;
  onAnswerChange?: (questionId: string, answer: string) => void;
  onBookmarkChange?: (questionId: string, bookmarked: boolean) => void;
  onFlagChange?: (questionId: string, flagged: boolean) => void;
  onRequestHint?: (questionId: string) => void;
  onQuestionChange?: (question: PracticeQuestion, index: number) => void;
  onExit?: () => void;
  className?: string;
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function formatTime(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
}

function getDifficultyStyle(difficulty?: PracticeDifficulty) {
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

function getTypeLabel(type: PracticeQuestionType) {
  switch (type) {
    case 'mcq':
      return 'MCQ';
    case 'cq':
      return 'CQ';
    case 'sq':
      return 'SQ';
    default:
      return 'Question';
  }
}

function isCorrectAnswer(question: PracticeQuestion, answer: string) {
  if (!question.answer) return null;

  if (question.type === 'mcq') {
    return normalize(question.answer) === normalize(answer);
  }

  return normalize(question.answer) === normalize(answer);
}

export default function PracticeEngine({
  questions,
  title = 'Practice Engine',
  subtitle = 'Bengali-first smart practice with progress tracking',
  loading = false,
  submitting = false,
  autoStartTimer = true,
  initialSeconds = 0,
  showTimer = true,
  showProgress = true,
  allowBookmark = true,
  allowFlag = true,
  allowHints = true,
  showExplanationAfterSubmit = true,
  onFinish,
  onAnswerChange,
  onBookmarkChange,
  onFlagChange,
  onRequestHint,
  onQuestionChange,
  onExit,
  className = '',
}: PracticeEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [running, setRunning] = useState(autoStartTimer);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [results, setResults] = useState<PracticeEngineResult[]>([]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] || null;

  const answeredCount = useMemo(
    () =>
      questions.filter((question) => {
        const value =
          selectedAnswers[question.id] ?? textAnswers[question.id] ?? '';
        return Boolean(value.trim());
      }).length,
    [questions, selectedAnswers, textAnswers],
  );

  const correctCount = useMemo(() => {
    return questions.reduce((count, question) => {
      const value = selectedAnswers[question.id] ?? textAnswers[question.id] ?? '';
      if (!value) return count;

      const correct = isCorrectAnswer(question, value);
      return correct === true ? count + 1 : count;
    }, 0);
  }, [questions, selectedAnswers, textAnswers]);

  const progress = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return Math.round((answeredCount / totalQuestions) * 100);
  }, [answeredCount, totalQuestions]);

  const elapsedSeconds = useMemo(() => {
    if (initialSeconds <= 0) return 0;
    return Math.max(0, initialSeconds - secondsLeft);
  }, [initialSeconds, secondsLeft]);

  const scorePercent = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return Math.round((correctCount / totalQuestions) * 100);
  }, [correctCount, totalQuestions]);

  useEffect(() => {
    if (!showTimer || !running || submitted || secondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        const next = Math.max(0, current - 1);
        if (next === 0) {
          window.clearInterval(timer);
          setRunning(false);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running, secondsLeft, showTimer, submitted]);

  useEffect(() => {
    if (!currentQuestion) return;
    onQuestionChange?.(currentQuestion, currentIndex);
  }, [currentIndex, currentQuestion, onQuestionChange]);

  useEffect(() => {
    if (!autoStartTimer) {
      setRunning(false);
    } else {
      setRunning(true);
    }
  }, [autoStartTimer]);

  const handleSelectAnswer = (questionId: string, value: string) => {
    setSelectedAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
    onAnswerChange?.(questionId, value);
  };

  const handleTextAnswerChange = (questionId: string, value: string) => {
    setTextAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
    onAnswerChange?.(questionId, value);
  };

  const handleBookmark = (questionId: string) => {
    setBookmarked((current) => {
      const next = new Set(current);
      const nextState = !next.has(questionId);
      if (nextState) next.add(questionId);
      else next.delete(questionId);
      onBookmarkChange?.(questionId, nextState);
      return next;
    });
  };

  const handleFlag = (questionId: string) => {
    setFlagged((current) => {
      const next = new Set(current);
      const nextState = !next.has(questionId);
      if (nextState) next.add(questionId);
      else next.delete(questionId);
      onFlagChange?.(questionId, nextState);
      return next;
    });
  };

  const goToQuestion = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, totalQuestions - 1));
    setCurrentIndex(nextIndex);
  };

  const goNext = () => {
    if (currentIndex < totalQuestions - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      goToQuestion(currentIndex - 1);
    }
  };

  const restartPractice = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setTextAnswers({});
    setBookmarked(new Set());
    setFlagged(new Set());
    setSubmitted(false);
    setResults([]);
    setRunning(autoStartTimer);
    setSecondsLeft(initialSeconds);
  };

  const submitPractice = async () => {
    const computedResults: PracticeEngineResult[] = questions.map((question) => {
      const answer =
        selectedAnswers[question.id] ?? textAnswers[question.id] ?? '';
      const correct = answer ? isCorrectAnswer(question, answer) : null;

      return {
        questionId: question.id,
        answer,
        correct,
        skipped: !answer,
        submittedAt: new Date().toISOString(),
      };
    });

    setResults(computedResults);
    setSubmitted(true);
    setRunning(false);
    await onFinish?.(computedResults);
  };

  const currentAnswer =
    selectedAnswers[currentQuestion?.id || ''] ??
    textAnswers[currentQuestion?.id || ''] ??
    '';

  const currentCorrect =
    submitted && currentQuestion ? isCorrectAnswer(currentQuestion, currentAnswer) : null;

  const currentDifficulty = getDifficultyStyle(currentQuestion?.difficulty);
  const currentTypeLabel = currentQuestion ? getTypeLabel(currentQuestion.type) : 'Question';

  return (
    <div
      className={[
        'overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]',
        'shadow-[0_20px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl',
        className,
      ].join(' ')}
    >
      <div className="relative overflow-hidden border-b border-white/10 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
              <Sparkles className="h-3.5 w-3.5" />
              BEP Practice
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white">
              {title}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="premium">{totalQuestions} Questions</Badge>

            {showTimer ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/15 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-100">
                <Clock3 className="h-4 w-4" />
                {formatTime(secondsLeft)}
              </div>
            ) : null}

            <Button variant="secondary" onClick={onExit}>
              Exit Practice
            </Button>
          </div>
        </div>

        {showProgress ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-cyan-100">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Progress
                </span>
              </div>
              <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {progress}%
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Answered {answeredCount} of {totalQuestions}
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-emerald-100">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Correct
                </span>
              </div>
              <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {submitted ? scorePercent : correctCount}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {submitted ? 'Final score' : 'Live correct count'}
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-fuchsia-100">
                <TimerReset className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Status
                </span>
              </div>
              <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {submitted ? 'Done' : running ? 'Live' : 'Paused'}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {submitted ? 'Practice submitted' : 'Practice in progress'}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="p-6">
          <div className="h-72 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]" />
        </div>
      ) : totalQuestions === 0 ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center p-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-[30px] border border-white/10 bg-white/[0.04]">
            <BookOpen className="h-11 w-11 text-white/35" />
          </div>
          <h3 className="mt-6 text-2xl font-bold tracking-tight text-white">
            প্রশ্ন পাওয়া যায়নি
          </h3>
          <p className="mt-3 max-w-lg text-sm leading-7 text-white/60">
            এই practice set এ এখনো কোনো প্রশ্ন যোগ করা হয়নি।
          </p>
        </div>
      ) : currentQuestion ? (
        <div className="p-6">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04]"
          >
            <div className="border-b border-white/10 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="premium">
                      {currentTypeLabel}
                    </Badge>
                    <div
                      className={[
                        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold',
                        currentDifficulty.className,
                      ].join(' ')}
                    >
                      <Star className="h-3.5 w-3.5" />
                      {currentDifficulty.label}
                    </div>
                    {currentQuestion.premium ? (
                      <Badge variant="warning">Premium</Badge>
                    ) : null}
                    {currentQuestion.locked ? (
                      <div className="inline-flex items-center gap-1 rounded-full border border-red-400/15 bg-red-400/10 px-3 py-1 text-[11px] font-semibold text-red-100">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Locked
                      </div>
                    ) : null}
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                    {currentQuestion.question}
                  </h3>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/55">
                    {currentQuestion.subject ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        {currentQuestion.subject}
                      </span>
                    ) : null}
                    {currentQuestion.chapter ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                        <Wand2 className="h-3.5 w-3.5" />
                        {currentQuestion.chapter}
                      </span>
                    ) : null}
                    {typeof currentQuestion.points === 'number' ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1.5 text-cyan-100">
                        <Trophy className="h-3.5 w-3.5" />
                        {currentQuestion.points} pts
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {allowBookmark ? (
                    <button
                      type="button"
                      onClick={() => handleBookmark(currentQuestion.id)}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/70 transition hover:border-cyan-400/15 hover:bg-cyan-400/10 hover:text-white"
                    >
                      {bookmarked.has(currentQuestion.id) ? (
                        <BookmarkCheck className="h-4 w-4 text-cyan-200" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                      {bookmarked.has(currentQuestion.id) ? 'Saved' : 'Save'}
                    </button>
                  ) : null}

                  {allowFlag ? (
                    <button
                      type="button"
                      onClick={() => handleFlag(currentQuestion.id)}
                      className={[
                        'inline-flex h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-medium transition',
                        flagged.has(currentQuestion.id)
                          ? 'border-amber-400/20 bg-amber-400/10 text-amber-100'
                          : 'border-white/10 bg-white/[0.04] text-white/70 hover:border-amber-400/15 hover:bg-amber-400/10 hover:text-white',
                      ].join(' ')}
                    >
                      <Flag className="h-4 w-4" />
                      {flagged.has(currentQuestion.id) ? 'Flagged' : 'Flag'}
                    </button>
                  ) : null}
                </div>
              </div>

              {currentQuestion.hint && allowHints ? (
                <div className="mt-5 rounded-3xl border border-cyan-400/15 bg-cyan-400/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-cyan-100">
                    <Lightbulb className="h-4 w-4" />
                    <span className="text-sm font-semibold">Hint available</span>
                  </div>
                  <p className="text-sm leading-7 text-white/75">
                    {currentQuestion.hint}
                  </p>
                  {onRequestHint ? (
                    <div className="mt-3">
                      <Button
                        variant="secondary"
                        onClick={() => onRequestHint(currentQuestion.id)}
                      >
                        Show hint action
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="p-5">
              {currentQuestion.imageUrl ? (
                <div className="mb-6 overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
                  <img
                    src={currentQuestion.imageUrl}
                    alt={currentQuestion.question}
                    className="h-64 w-full object-cover"
                  />
                </div>
              ) : null}

              {currentQuestion.type === 'mcq' ? (
                <div className="space-y-3">
                  {(currentQuestion.options || []).map((option) => {
                    const active =
                      selectedAnswers[currentQuestion.id] === option.value;
                    const revealed = submitted && showExplanationAfterSubmit;
                    const correct = revealed && currentQuestion.answer
                      ? normalize(option.value) === normalize(currentQuestion.answer)
                      : false;
                    const wrongSelection =
                      revealed &&
                      active &&
                      currentQuestion.answer &&
                      normalize(option.value) !== normalize(currentQuestion.answer);

                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={currentQuestion.locked}
                        onClick={() =>
                          handleSelectAnswer(currentQuestion.id, option.value)
                        }
                        className={[
                          'group relative w-full overflow-hidden rounded-3xl border px-5 py-4 text-left transition-all duration-300',
                          currentQuestion.locked
                            ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-white/30'
                            : 'backdrop-blur-xl',
                          correct
                            ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                            : wrongSelection
                              ? 'border-red-400/20 bg-red-400/10 text-red-100'
                              : active
                                ? 'border-cyan-400/20 bg-cyan-400/15 text-cyan-100 shadow-[0_10px_35px_rgba(6,182,212,0.18)]'
                                : 'border-white/10 bg-white/[0.04] text-white/75 hover:border-cyan-400/15 hover:bg-white/[0.06] hover:text-white',
                        ].join(' ')}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                        <div className="relative z-10 flex items-center gap-4">
                          <div
                            className={[
                              'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-bold transition',
                              correct
                                ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                                : wrongSelection
                                  ? 'border-red-400/20 bg-red-400/10 text-red-100'
                                  : active
                                    ? 'border-cyan-400/20 bg-cyan-400/15 text-cyan-100'
                                    : 'border-white/10 bg-white/[0.04] text-white/55',
                            ].join(' ')}
                          >
                            {option.label}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-7">{option.value}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {submitted && showExplanationAfterSubmit && correct ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                            ) : null}
                            {submitted && showExplanationAfterSubmit && wrongSelection ? (
                              <AlertCircle className="h-5 w-5 text-red-200" />
                            ) : null}
                            {active && !submitted ? (
                              <div className="h-3 w-3 rounded-full bg-cyan-300" />
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <label className="mb-3 block text-sm font-semibold text-white/85">
                      Your answer
                    </label>
                    <textarea
                      rows={10}
                      value={currentAnswer}
                      onChange={(e) =>
                        handleTextAnswerChange(currentQuestion.id, e.target.value)
                      }
                      placeholder="বাংলায় লিখে উত্তর দিন..."
                      className="w-full rounded-2xl border border-white/10 bg-[#08111F]/70 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/15"
                    />
                  </div>

                  {submitted && showExplanationAfterSubmit && currentQuestion.answer ? (
                    <div className="rounded-3xl border border-emerald-400/15 bg-emerald-400/10 p-5">
                      <div className="mb-2 flex items-center gap-2 text-emerald-100">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-semibold">Model answer</span>
                      </div>
                      <p className="text-sm leading-7 text-white/75">
                        {currentQuestion.answer}
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              {submitted && showExplanationAfterSubmit && currentQuestion.explanation ? (
                <div className="mt-6 rounded-3xl border border-cyan-400/15 bg-cyan-400/10 p-5">
                  <div className="mb-2 flex items-center gap-2 text-cyan-100">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-semibold">Explanation</span>
                  </div>
                  <p className="text-sm leading-7 text-white/75">
                    {currentQuestion.explanation}
                  </p>
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  onClick={submitPractice}
                  loading={submitting}
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                >
                  Submit Practice
                </Button>

                <Button
                  variant="secondary"
                  onClick={goPrevious}
                  disabled={currentIndex === 0}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Previous
                </Button>

                <Button
                  variant="secondary"
                  onClick={goNext}
                  disabled={currentIndex === totalQuestions - 1}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Next
                </Button>

                <Button
                  variant="ghost"
                  onClick={restartPractice}
                  leftIcon={<RotateCcw className="h-4 w-4" />}
                >
                  Restart
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-center gap-2 text-white/75">
                <Sparkles className="h-4 w-4 text-fuchsia-100" />
                <span className="text-sm font-semibold">Question navigator</span>
              </div>

              <div className="grid grid-cols-5 gap-3 sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-10">
                {questions.map((question, index) => {
                  const active = index === currentIndex;
                  const answered = Boolean(
                    selectedAnswers[question.id] || textAnswers[question.id],
                  );

                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => goToQuestion(index)}
                      className={[
                        'relative flex aspect-square items-center justify-center border text-sm font-bold transition-all duration-300',
                        active
                          ? 'border-cyan-400/20 bg-cyan-400/15 text-cyan-100 shadow-[0_10px_35px_rgba(6,182,212,0.20)]'
                          : flagged.has(question.id)
                            ? 'border-amber-400/20 bg-amber-400/10 text-amber-100'
                            : answered
                              ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                              : bookmarked.has(question.id)
                                ? 'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100'
                                : 'border-white/10 bg-white/[0.04] text-white/65 hover:border-cyan-400/15 hover:bg-white/[0.07] hover:text-white',
                      ].join(' ')}
                    >
                      {question.id.length > 0 ? index + 1 : index + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-3 flex items-center gap-2 text-cyan-100">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-semibold">Live stats</span>
                </div>

                <div className="space-y-3 text-sm text-white/65">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#08111F]/70 px-4 py-3">
                    <span>Answered</span>
                    <span className="font-semibold text-white">{answeredCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#08111F]/70 px-4 py-3">
                    <span>Correct</span>
                    <span className="font-semibold text-white">{correctCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#08111F]/70 px-4 py-3">
                    <span>Score</span>
                    <span className="font-semibold text-white">{scorePercent}%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#08111F]/70 px-4 py-3">
                    <span>Timer</span>
                    <span className="font-semibold text-white">{formatTime(secondsLeft)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-3 flex items-center gap-2 text-orange-100">
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm font-semibold">Summary</span>
                </div>

                <p className="text-sm leading-7 text-white/65">
                  {submitted
                    ? `Practice submitted successfully. You answered ${answeredCount} questions and scored ${scorePercent}%.`
                    : `You have answered ${answeredCount} out of ${totalQuestions} questions. Keep going!`}
                </p>
              </div>
            </div>
          </div>

          {submitted && results.length > 0 ? (
            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-center gap-2 text-emerald-100">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-semibold">Result snapshot</span>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {results.slice(0, 6).map((item) => (
                  <div
                    key={item.questionId}
                    className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-white">
                        {item.questionId}
                      </span>
                      <span
                        className={[
                          'rounded-full border px-2.5 py-1 text-[11px] font-semibold',
                          item.skipped
                            ? 'border-white/10 bg-white/[0.04] text-white/55'
                            : item.correct
                              ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                              : 'border-red-400/20 bg-red-400/10 text-red-100',
                        ].join(' ')}
                      >
                        {item.skipped ? 'Skipped' : item.correct ? 'Correct' : 'Wrong'}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-white/50">
                      {item.answer || 'No answer'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
