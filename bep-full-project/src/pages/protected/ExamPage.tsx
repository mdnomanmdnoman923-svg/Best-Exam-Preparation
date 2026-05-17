// bep-full-project/src/pages/protected/ExamPage.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bookmark,
  BookmarkCheck,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  Layers3,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TimerReset,
  Trophy,
  X,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type ExamStatus =
  | 'running'
  | 'paused'
  | 'completed';

type QuestionType =
  | 'mcq'
  | 'written';

interface ExamOption {
  id: string;
  label: string;
  value: string;
}

interface ExamQuestion {
  id: string;
  title?: string;
  question: string;
  type: QuestionType;
  options?: ExamOption[];
  correctOptionId?: string;
  explanation?: string;
  marks: number;
  bookmarked?: boolean;
  flagged?: boolean;
}

interface ExamData {
  id: string;
  title: string;
  subject: string;
  chapter?: string;
  durationMinutes: number;
  totalMarks: number;
  instructions: string[];
  premium?: boolean;
  questions: ExamQuestion[];
}

const examData: ExamData = {
  id: 'exam-1',
  title: 'HSC Physics Mock Exam',
  subject: 'Physics',
  chapter: 'Motion and Force',
  durationMinutes: 45,
  totalMarks: 50,
  premium: true,
  instructions: [
    'প্রতি প্রশ্ন মনোযোগ দিয়ে পড়ুন এবং উত্তর জমা দেওয়ার আগে review করুন।',
    'MCQ প্রশ্নে একটি option select করুন, written প্রশ্নে concise answer দিন।',
    'সময় শেষ হলে exam auto-submit হতে পারে।',
  ],
  questions: [
    {
      id: 'q-1',
      title: 'Basic Formula',
      question: 'Speed এর formula কোনটি?',
      type: 'mcq',
      marks: 2,
      options: [
        { id: 'a', label: 'A', value: 'distance × time' },
        { id: 'b', label: 'B', value: 'distance / time' },
        { id: 'c', label: 'C', value: 'time / distance' },
        { id: 'd', label: 'D', value: 'mass / time' },
      ],
      correctOptionId: 'b',
      explanation: 'Speed = distance covered divided by time taken.',
    },
    {
      id: 'q-2',
      title: 'Concept Check',
      question: 'Force কীভাবে motion change করতে পারে?',
      type: 'written',
      marks: 4,
      explanation: 'Force can start, stop, speed up, slow down, or change direction of motion.',
    },
    {
      id: 'q-3',
      title: 'Application',
      question: 'If a body covers 30m in 6s, what is its speed?',
      type: 'mcq',
      marks: 2,
      options: [
        { id: 'a', label: 'A', value: '3 m/s' },
        { id: 'b', label: 'B', value: '4 m/s' },
        { id: 'c', label: 'C', value: '5 m/s' },
        { id: 'd', label: 'D', value: '6 m/s' },
      ],
      correctOptionId: 'c',
      explanation: 'Speed = 30 ÷ 6 = 5 m/s.',
    },
    {
      id: 'q-4',
      title: 'Short Answer',
      question: 'Velocity এবং speed এর মধ্যে একটি পার্থক্য লিখো।',
      type: 'written',
      marks: 4,
      explanation: 'Velocity has direction; speed does not.',
    },
    {
      id: 'q-5',
      title: 'Net Force',
      question: 'Net force zero হলে motion কেমন হবে?',
      type: 'mcq',
      marks: 2,
      options: [
        { id: 'a', label: 'A', value: 'Motion stops instantly' },
        { id: 'b', label: 'B', value: 'Uniform motion continues' },
        { id: 'c', label: 'C', value: 'Speed always increases' },
        { id: 'd', label: 'D', value: 'Direction changes randomly' },
      ],
      correctOptionId: 'b',
      explanation: 'Zero net force means no change in motion state.',
    },
  ],
};

function formatTime(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getOptionKey(index: number) {
  return String.fromCharCode(65 + index);
}

function QuestionNavItem({
  index,
  active,
  bookmarked,
  answered,
  onClick,
}: {
  index: number;
  active: boolean;
  bookmarked?: boolean;
  answered?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-bold transition',
        active
          ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
          : answered
            ? 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100'
            : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
      ].join(' ')}
      title={`Question ${index + 1}`}
    >
      <span className="relative">
        {index + 1}
        {bookmarked ? (
          <BookmarkCheck className="absolute -right-3 -top-3 h-3.5 w-3.5 text-fuchsia-100" />
        ) : null}
      </span>
    </button>
  );
}

function StatCard({
  title,
  value,
  icon,
  accent = 'cyan',
  note,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: 'cyan' | 'emerald' | 'amber' | 'fuchsia';
  note?: string;
}) {
  const accentMap = {
    cyan: 'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
    emerald: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
    amber: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
    fuchsia: 'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
  } as const;

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-white/55">{title}</p>
          <h3 className="mt-2 text-4xl font-black tracking-tight text-white">{value}</h3>
          {note ? <p className="mt-2 text-sm text-white/45">{note}</p> : null}
        </div>

        <div className={['flex h-14 w-14 items-center justify-center rounded-2xl border', accentMap[accent]].join(' ')}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-100">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-7 text-white/55">{description}</p>
      </div>
    </div>
  );
}

function QuestionBody({
  question,
  value,
  onSelectOption,
  onChangeWritten,
}: {
  question: ExamQuestion;
  value: string;
  onSelectOption: (optionId: string) => void;
  onChangeWritten: (text: string) => void;
}) {
  if (question.type === 'mcq') {
    return (
      <div className="space-y-3">
        {question.options?.map((option, index) => {
          const isSelected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectOption(option.id)}
              className={[
                'flex w-full items-start gap-3 rounded-[24px] border p-4 text-left transition',
                isSelected
                  ? 'border-cyan-400/20 bg-cyan-400/10'
                  : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.06]',
              ].join(' ')}
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-sm font-bold text-cyan-100">
                {getOptionKey(index)}
              </span>
              <span className="text-sm leading-7 text-white/75">{option.value}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <textarea
      value={value}
      onChange={(e) => onChangeWritten(e.target.value)}
      rows={8}
      placeholder="Write your answer..."
      className="w-full rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/20 focus:bg-white/[0.06]"
    />
  );
}

export default function ExamPage() {
  const [status, setStatus] = useState<ExamStatus>('running');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(examData.durationMinutes * 60);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = examData.questions[currentIndex];

  useEffect(() => {
    if (status !== 'running') return;

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          setStatus('completed');
          setShowResult(true);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status]);

  const answeredCount = useMemo(
    () => Object.values(answers).filter((value) => Boolean(value?.trim())).length,
    [answers],
  );

  const bookmarkedCount = useMemo(
    () => examData.questions.filter((question) => question.bookmarked).length,
    [],
  );

  const totalProgress = useMemo(() => {
    if (examData.questions.length === 0) return 0;
    return Math.round((answeredCount / examData.questions.length) * 100);
  }, [answeredCount]);

  const scorePreview = useMemo(() => {
    let score = 0;
    examData.questions.forEach((question) => {
      const answer = answers[question.id];
      if (!answer) return;

      if (question.type === 'mcq') {
        if (answer === question.correctOptionId) {
          score += question.marks;
        }
      } else {
        score += Math.max(1, Math.ceil(question.marks * 0.5));
      }
    });
    return score;
  }, [answers]);

  const updateAnswer = (questionId: string, value: string) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  };

  const toggleBookmark = (questionId: string) => {
    // local demo-only toggle
    examData.questions = examData.questions.map((question) =>
      question.id === questionId
        ? { ...question, bookmarked: !question.bookmarked }
        : question,
    );
    setCurrentIndex((previous) => previous);
  };

  const toggleFlag = (questionId: string) => {
    examData.questions = examData.questions.map((question) =>
      question.id === questionId
        ? { ...question, flagged: !question.flagged }
        : question,
    );
    setCurrentIndex((previous) => previous);
  };

  const goPrevious = () => {
    setCurrentIndex((previous) => Math.max(0, previous - 1));
  };

  const goNext = () => {
    setCurrentIndex((previous) => Math.min(examData.questions.length - 1, previous + 1));
  };

  const handlePause = () => {
    setStatus((previous) => (previous === 'running' ? 'paused' : 'running'));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 700));
      setStatus('completed');
      setShowSubmitConfirm(false);
      setShowResult(true);
    } finally {
      setSaving(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeWarning = timeLeft <= 5 * 60;
  const timeCritical = timeLeft <= 60;

  return (
    <div className="min-h-screen bg-[#050816] p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
          <div className="relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  BEP Exam Mode
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  {examData.title}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  {examData.subject}
                  {examData.chapter ? ` · ${examData.chapter}` : ''}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Protected
                </Badge>
                <Badge variant="premium">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  Secure Exam
                </Badge>
                {examData.premium ? <Badge variant="premium">Premium</Badge> : null}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Time Left"
            value={formatTime(timeLeft)}
            icon={<Clock3 className="h-5 w-5" />}
            accent={timeCritical ? 'fuchsia' : timeWarning ? 'amber' : 'cyan'}
            note={status === 'running' ? 'Exam is live' : status === 'paused' ? 'Exam paused' : 'Exam ended'}
          />
          <StatCard
            title="Answered"
            value={`${answeredCount}/${examData.questions.length}`}
            icon={<Target className="h-5 w-5" />}
            accent="emerald"
            note="Questions completed"
          />
          <StatCard
            title="Progress"
            value={`${totalProgress}%`}
            icon={<Layers3 className="h-5 w-5" />}
            accent="fuchsia"
            note="Overall attempt progress"
          />
          <StatCard
            title="Preview Score"
            value={scorePreview}
            icon={<Trophy className="h-5 w-5" />}
            accent="amber"
            note={`Marks shown out of ${examData.totalMarks}`}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <aside className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <SectionTitle
                icon={<TimerReset className="h-4 w-4" />}
                title="Exam timer"
                description="সময় শেষ হওয়ার আগে answers review করুন।"
              />

              <div className="flex items-center justify-between rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5">
                <div>
                  <p className="text-sm text-white/55">Current status</p>
                  <h3 className="mt-2 text-3xl font-black text-white">
                    {status === 'running' ? 'Running' : status === 'paused' ? 'Paused' : 'Completed'}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={handlePause} leftIcon={status === 'running' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}>
                    {status === 'running' ? 'Pause' : 'Resume'}
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <InfoStat label="Total marks" value={examData.totalMarks} />
                <InfoStat label="Questions" value={examData.questions.length} />
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <SectionTitle
                icon={<Layers3 className="h-4 w-4" />}
                title="Question navigator"
                description="এক ক্লিকে প্রশ্নে jump করুন, bookmark / flag status সহ।"
              />

              <div className="grid grid-cols-5 gap-3 md:grid-cols-6 xl:grid-cols-5">
                {examData.questions.map((question, index) => (
                  <QuestionNavItem
                    key={question.id}
                    index={index}
                    active={index === currentIndex}
                    answered={Boolean(answers[question.id])}
                    bookmarked={question.bookmarked}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-white/50">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Active
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Answered
                </span>
                <span className="inline-flex items-center gap-1">
                  <BookmarkCheck className="h-3.5 w-3.5 text-fuchsia-100" />
                  Bookmarked
                </span>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <SectionTitle
                icon={<BookmarkCheck className="h-4 w-4" />}
                title="Exam instructions"
                description="Live exam শুরু করার আগে carefully read করুন।"
              />

              <div className="space-y-3">
                {examData.instructions.map((instruction, index) => (
                  <div
                    key={instruction}
                    className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-[#08111F]/75 p-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold text-cyan-100">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-7 text-white/65">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
                <Star className="h-4 w-4" />
                <span className="text-sm font-semibold">Quick actions</span>
              </div>

              <div className="space-y-3">
                <ActionButton label="Go previous" icon={<ChevronLeft className="h-4 w-4" />} onClick={goPrevious} />
                <ActionButton label="Go next" icon={<ChevronRight className="h-4 w-4" />} onClick={goNext} />
                <ActionButton label="Review answers" icon={<BadgeCheck className="h-4 w-4" />} onClick={() => setShowSubmitConfirm(true)} />
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="premium">Question {currentIndex + 1}</Badge>
                    <Badge variant={currentQuestion.type === 'mcq' ? 'success' : 'warning'}>
                      {currentQuestion.type.toUpperCase()}
                    </Badge>
                    <Badge variant="secondary">
                      {currentQuestion.marks} marks
                    </Badge>
                    {currentQuestion.bookmarked ? <Badge variant="premium">Bookmarked</Badge> : null}
                    {currentQuestion.flagged ? <Badge variant="danger">Flagged</Badge> : null}
                  </div>

                  <h2 className="text-3xl font-black tracking-tight text-white">
                    {currentQuestion.title || 'Question'}
                  </h2>

                  <p className="mt-4 text-sm leading-8 text-white/75">
                    {currentQuestion.question}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(currentQuestion.id)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    {currentQuestion.bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    {currentQuestion.bookmarked ? 'Saved' : 'Bookmark'}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleFlag(currentQuestion.id)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    <Flag className="h-4 w-4" />
                    {currentQuestion.flagged ? 'Unflag' : 'Flag'}
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-[26px] border border-white/10 bg-[#08111F]/75 p-4">
                <div className="mb-3 flex items-center gap-2 text-cyan-100">
                  <Brain className="h-4 w-4" />
                  <span className="text-sm font-semibold">Answer area</span>
                </div>

                <QuestionBody
                  question={currentQuestion}
                  value={answers[currentQuestion.id] || ''}
                  onSelectOption={(optionId) => updateAnswer(currentQuestion.id, optionId)}
                  onChangeWritten={(text) => updateAnswer(currentQuestion.id, text)}
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Clock3 className="h-4 w-4" />
                  {status === 'running' ? 'Timer is active' : 'Timer is paused'}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={goPrevious} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                    Previous
                  </Button>
                  <Button variant="secondary" onClick={goNext} leftIcon={<ArrowRight className="h-4 w-4" />}>
                    Next
                  </Button>
                  <Button
                    onClick={() => setShowSubmitConfirm(true)}
                    leftIcon={<Send className="h-4 w-4" />}
                  >
                    Submit Exam
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <SectionTitle
                  icon={<ShieldCheck className="h-4 w-4" />}
                  title="Exam progress"
                  description="Answer completion and review status."
                />

                <div className="space-y-3">
                  <ProgressRow label="Answered" value={answeredCount} total={examData.questions.length} />
                  <ProgressRow label="Bookmarked" value={bookmarkedCount} total={examData.questions.length} />
                  <ProgressRow label="Current question" value={currentIndex + 1} total={examData.questions.length} />
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2 text-emerald-100">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-semibold">Answer preview</span>
                </div>

                <div className="space-y-3">
                  <InfoStat label="Current answer" value={answers[currentQuestion.id] || '--'} />
                  <InfoStat label="Marks" value={currentQuestion.marks} />
                  <InfoStat label="Question type" value={currentQuestion.type.toUpperCase()} />
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2 text-cyan-100">
                <Trophy className="h-4 w-4" />
                <span className="text-sm font-semibold">Exam summary</span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <SummaryStat label="Total questions" value={examData.questions.length} />
                <SummaryStat label="Answered" value={answeredCount} />
                <SummaryStat label="Estimated score" value={`${scorePreview}/${examData.totalMarks}`} />
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
                <p className="text-sm leading-7 text-white/75">
                  Think carefully before submitting. You can still review unanswered items from the navigator.
                </p>
              </div>
            </div>
          </main>
        </div>

        {showSubmitConfirm ? (
          <ModalShell onClose={() => setShowSubmitConfirm(false)}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Final Review
                </div>

                <h2 className="text-3xl font-black tracking-tight text-white">
                  Submit exam?
                </h2>

                <p className="mt-2 text-sm leading-7 text-white/60">
                  Your answers will be locked after submission. Please review once more.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="rounded-2xl border border-white/10 p-3 text-white/70 transition hover:bg-white/[0.05]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <InfoStat label="Answered" value={`${answeredCount}/${examData.questions.length}`} />
              <InfoStat label="Time left" value={formatTime(timeLeft)} />
            </div>

            <div className="mt-5 rounded-[28px] border border-amber-400/15 bg-amber-400/10 p-4">
              <div className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-100" />
                <p className="text-sm leading-7 text-white/75">
                  সাবমিট করার পর result page দেখানো হবে। Unanswered প্রশ্ন থাকলে marks পাওয়া যাবে না।
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                onClick={handleSubmit}
                disabled={saving}
                leftIcon={
                  saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )
                }
              >
                {saving ? 'Submitting...' : 'Yes, submit'}
              </Button>

              <Button variant="secondary" onClick={() => setShowSubmitConfirm(false)}>
                Continue exam
              </Button>
            </div>
          </ModalShell>
        ) : null}

        {showResult ? (
          <ModalShell onClose={() => setShowResult(false)} maxWidth="max-w-4xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                  <Trophy className="h-3.5 w-3.5" />
                  Exam Completed
                </div>

                <h2 className="text-3xl font-black tracking-tight text-white">
                  Result Preview
                </h2>

                <p className="mt-2 text-sm leading-7 text-white/60">
                  This is a demo result state. You can connect it to your result engine later.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowResult(false)}
                className="rounded-2xl border border-white/10 p-3 text-white/70 transition hover:bg-white/[0.05]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <InfoStat label="Answered" value={answeredCount} />
              <InfoStat label="Score" value={`${scorePreview}/${examData.totalMarks}`} />
              <InfoStat label="Accuracy" value={`${Math.round((answeredCount / examData.questions.length) * 100) || 0}%`} />
              <InfoStat label="Status" value="Saved" />
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-center gap-2 text-cyan-100">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-semibold">Next steps</span>
              </div>

              <div className="space-y-3 text-sm leading-7 text-white/65">
                <p>Wrong answers review করে weak topics list update করা যেতে পারে।</p>
                <p>Result data save করে progress analytics and leaderboard ranking update করুন।</p>
                <p>Practice session link করে related chapter revision recommend করা যেতে পারে।</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => window.location.reload()} leftIcon={<RotateCcw className="h-4 w-4" />}>
                Retake demo
              </Button>
              <Button variant="secondary" onClick={() => setShowResult(false)}>
                Close
              </Button>
            </div>
          </ModalShell>
        ) : null}
      </div>
    </div>
  );
}

function ModalShell({
  children,
  onClose,
  maxWidth = 'max-w-3xl',
}: {
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
      <div className={['w-full', maxWidth, 'rounded-[32px] border border-white/10 bg-[#08111F] p-6 shadow-2xl'].join(' ')}>
        {children}
      </div>
    </div>
  );
}

function InfoStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">{label}</div>
      <div className="mt-1 text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-white/60">
        <span>{label}</span>
        <span>
          {value}/{total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/65 transition hover:bg-white/[0.08] hover:text-white"
    >
      <span>{label}</span>
      <span className="text-cyan-100">{icon}</span>
    </button>
  );
}

function SummaryStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#08111F]/75 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
        {label}
      </div>
      <div className="mt-2 text-3xl font-black tracking-tight text-white">
        {value}
      </div>
    </div>
  );
}
