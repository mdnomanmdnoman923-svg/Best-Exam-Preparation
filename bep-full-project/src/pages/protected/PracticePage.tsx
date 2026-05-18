// bep-full-project/src/pages/protected/PracticePage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Flame,
  Loader2,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TimerReset,
  Trophy,
  Wand2,
  XCircle,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type PracticeQuestionType = 'mcq' | 'written';
type PracticeDifficulty = 'easy' | 'medium' | 'hard';
type PracticeMode = 'topic' | 'mixed' | 'revision';

interface PracticeOption {
  id: string;
  label: string;
  value: string;
}

interface PracticeQuestion {
  id: string;
  subject: string;
  chapter: string;
  title: string;
  question: string;
  type: PracticeQuestionType;
  difficulty: PracticeDifficulty;
  marks: number;
  options?: PracticeOption[];
  answer?: string;
  explanation?: string;
  hint?: string;
  bookmarked?: boolean;
  weakTopic?: boolean;
  tag?: string;
}

interface WeakTopicItem {
  id: string;
  topic: string;
  subject: string;
  accuracy: number;
  attempts: number;
  recommended: string;
}

const practiceQuestions: PracticeQuestion[] = [
  {
    id: 'pq-1',
    subject: 'Physics',
    chapter: 'Motion and Force',
    title: 'Speed formula',
    question: 'A body covers 60 m in 12 s. What is its speed?',
    type: 'mcq',
    difficulty: 'easy',
    marks: 2,
    options: [
      { id: 'a', label: 'A', value: '3 m/s' },
      { id: 'b', label: 'B', value: '4 m/s' },
      { id: 'c', label: 'C', value: '5 m/s' },
      { id: 'd', label: 'D', value: '6 m/s' },
    ],
    answer: 'c',
    explanation: 'Speed = distance ÷ time = 60 ÷ 12 = 5 m/s.',
    hint: 'Use the basic speed formula.',
    bookmarked: true,
    weakTopic: false,
    tag: 'formula',
  },
  {
    id: 'pq-2',
    subject: 'Mathematics',
    chapter: 'Linear Equation',
    title: 'Solve for x',
    question: 'Solve: 2x + 7 = 19',
    type: 'written',
    difficulty: 'easy',
    marks: 3,
    answer: 'x = 6',
    explanation: 'Subtract 7 from both sides, then divide by 2.',
    hint: 'First isolate the term with x.',
    bookmarked: false,
    weakTopic: true,
    tag: 'algebra',
  },
  {
    id: 'pq-3',
    subject: 'Chemistry',
    chapter: 'Atomic Structure',
    title: 'Atomic number',
    question: 'What does the atomic number of an element represent?',
    type: 'mcq',
    difficulty: 'medium',
    marks: 2,
    options: [
      { id: 'a', label: 'A', value: 'Number of protons' },
      { id: 'b', label: 'B', value: 'Number of neutrons' },
      { id: 'c', label: 'C', value: 'Number of electrons + neutrons' },
      { id: 'd', label: 'D', value: 'Mass number' },
    ],
    answer: 'a',
    explanation: 'Atomic number is the number of protons in the nucleus.',
    hint: 'Think of the nucleus composition.',
    bookmarked: false,
    weakTopic: false,
    tag: 'concept',
  },
  {
    id: 'pq-4',
    subject: 'English',
    chapter: 'Grammar',
    title: 'Voice change',
    question: 'Convert into passive voice: "The boy kicks the ball."',
    type: 'written',
    difficulty: 'medium',
    marks: 4,
    answer: 'The ball is kicked by the boy.',
    explanation: 'Object becomes subject in passive voice.',
    hint: 'Object first, then auxiliary + past participle.',
    bookmarked: true,
    weakTopic: true,
    tag: 'grammar',
  },
  {
    id: 'pq-5',
    subject: 'Biology',
    chapter: 'Photosynthesis',
    title: 'Main site',
    question: 'Where does photosynthesis mainly take place in a plant?',
    type: 'mcq',
    difficulty: 'easy',
    marks: 2,
    options: [
      { id: 'a', label: 'A', value: 'Roots' },
      { id: 'b', label: 'B', value: 'Stem' },
      { id: 'c', label: 'C', value: 'Leaves' },
      { id: 'd', label: 'D', value: 'Flowers' },
    ],
    answer: 'c',
    explanation: 'Photosynthesis mainly occurs in the leaves due to chloroplasts.',
    hint: 'Look for the green part.',
    bookmarked: false,
    weakTopic: false,
    tag: 'biology',
  },
];

const weakTopics: WeakTopicItem[] = [
  {
    id: 'wt-1',
    topic: 'Linear equations',
    subject: 'Mathematics',
    accuracy: 62,
    attempts: 18,
    recommended: 'Practice 10 more MCQs and 2 short-answer problems.',
  },
  {
    id: 'wt-2',
    topic: 'Voice change',
    subject: 'English',
    accuracy: 58,
    attempts: 14,
    recommended: 'Revise rules and solve transformation drills.',
  },
  {
    id: 'wt-3',
    topic: 'Atomic structure',
    subject: 'Chemistry',
    accuracy: 70,
    attempts: 20,
    recommended: 'Review proton/neutron/electron basics.',
  },
];

const subjectOptions = ['All', 'Physics', 'Mathematics', 'Chemistry', 'Biology', 'English'] as const;
const difficultyOptions = ['All', 'easy', 'medium', 'hard'] as const;
const modeOptions = [
  { id: 'topic', label: 'Topic' },
  { id: 'mixed', label: 'Mixed' },
  { id: 'revision', label: 'Revision' },
] as const;

function formatPercentage(value: number) {
  return `${Math.round(value)}%`;
}

function getDifficultyBadgeVariant(difficulty: PracticeDifficulty) {
  if (difficulty === 'easy') return 'success' as const;
  if (difficulty === 'medium') return 'warning' as const;
  return 'danger' as const;
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

function QuestionCard({
  question,
  selectedAnswer,
  writtenAnswer,
  onSelectAnswer,
  onChangeWritten,
  onToggleBookmark,
}: {
  question: PracticeQuestion;
  selectedAnswer: string;
  writtenAnswer: string;
  onSelectAnswer: (optionId: string) => void;
  onChangeWritten: (value: string) => void;
  onToggleBookmark: (id: string) => void;
}) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="premium">{question.subject}</Badge>
        <Badge variant="secondary">{question.chapter}</Badge>
        <Badge variant={getDifficultyBadgeVariant(question.difficulty)}>{question.difficulty}</Badge>
        {question.bookmarked ? <Badge variant="success">Bookmarked</Badge> : null}
        {question.weakTopic ? <Badge variant="warning">Weak Topic</Badge> : null}
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-3xl font-black tracking-tight text-white">{question.title}</h3>
          <p className="mt-3 text-sm leading-8 text-white/75">{question.question}</p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/50">
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-cyan-100" />
              {question.marks} marks
            </span>

            {question.tag ? (
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-fuchsia-100" />
                {question.tag}
              </span>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleBookmark(question.id)}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
        >
          <Star className="h-4 w-4" />
          {question.bookmarked ? 'Saved' : 'Save'}
        </button>
      </div>

      <div className="mt-5 rounded-[28px] border border-white/10 bg-[#08111F]/75 p-4">
        <div className="mb-3 flex items-center gap-2 text-cyan-100">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm font-semibold">Answer area</span>
        </div>

        {question.type === 'mcq' ? (
          <div className="space-y-3">
            {question.options?.map((option, index) => {
              const selected = selectedAnswer === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onSelectAnswer(option.id)}
                  className={[
                    'flex w-full items-start gap-3 rounded-[24px] border p-4 text-left transition',
                    selected
                      ? 'border-cyan-400/20 bg-cyan-400/10'
                      : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.06]',
                  ].join(' ')}
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-sm font-bold text-cyan-100">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-sm leading-7 text-white/75">{option.value}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <textarea
            value={writtenAnswer}
            onChange={(e) => onChangeWritten(e.target.value)}
            rows={7}
            placeholder="Write your answer..."
            className="w-full rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/20 focus:bg-white/[0.06]"
          />
        )}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Hint</p>
          <p className="mt-2 text-sm leading-7 text-white/65">{question.hint || '--'}</p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Explain</p>
          <p className="mt-2 text-sm leading-7 text-white/65">{question.explanation || '--'}</p>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  label,
  icon,
  active = false,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition',
        active
          ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
          : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
      ].join(' ')}
    >
      {icon}
      {label}
    </button>
  );
}

function WeakTopicCard({ item }: { item: WeakTopicItem }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#08111F]/75 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-white">{item.topic}</h4>
            <Badge variant="secondary">{item.subject}</Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-white/55">{item.recommended}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-right">
          <div className="text-xs uppercase tracking-wider text-white/40">Accuracy</div>
          <div className="mt-1 text-lg font-bold text-white">{formatPercentage(item.accuracy)}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2 text-sm text-white/50">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
          Attempts: {item.attempts}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
          Next step: review + practice
        </div>
      </div>
    </div>
  );
}

export default function PracticePage() {
  const [subject, setSubject] = useState<(typeof subjectOptions)[number]>('All');
  const [difficulty, setDifficulty] = useState<(typeof difficultyOptions)[number]>('All');
  const [mode, setMode] = useState<PracticeMode>('topic');
  const [search, setSearch] = useState('');
  const [loading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const filteredQuestions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return practiceQuestions.filter((question) => {
      const matchesSubject = subject === 'All' || question.subject === subject;
      const matchesDifficulty = difficulty === 'All' || question.difficulty === difficulty;
      const matchesSearch =
        !query ||
        [
          question.title,
          question.question,
          question.subject,
          question.chapter,
          question.tag,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query);

      return matchesSubject && matchesDifficulty && matchesSearch;
    });
  }, [difficulty, search, subject]);

  const currentQuestion = filteredQuestions[selectedIndex] || filteredQuestions[0] || practiceQuestions[0];

  const progress = useMemo(() => {
    const total = filteredQuestions.length || 1;
    const answered = filteredQuestions.filter((question) => Boolean(answers[question.id]?.trim())).length;
    return Math.round((answered / total) * 100);
  }, [answers, filteredQuestions]);

  const stats = useMemo(() => {
    const attempts = Object.values(answers).filter(Boolean).length;
    const bookmarked = practiceQuestions.filter((question) => question.bookmarked).length;
    const weakCount = practiceQuestions.filter((question) => question.weakTopic).length;

    return {
      total: practiceQuestions.length,
      filtered: filteredQuestions.length,
      attempts,
      bookmarked,
      weakCount,
    };
  }, [answers, filteredQuestions]);

  const currentAnswer = answers[currentQuestion?.id || ''] || '';

  const updateAnswer = (questionId: string, value: string) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  };

  const toggleBookmark = (questionId: string) => {
    // Demo local toggle for the static seed list
    const index = practiceQuestions.findIndex((item) => item.id === questionId);
    if (index === -1) return;
    practiceQuestions[index] = {
      ...practiceQuestions[index],
      bookmarked: !practiceQuestions[index].bookmarked,
    };
  };

  const resetFilters = () => {
    setSubject('All');
    setDifficulty('All');
    setSearch('');
    setSelectedIndex(0);
  };

  const handleNext = () => {
    setSelectedIndex((previous) => Math.min(filteredQuestions.length - 1, previous + 1));
  };

  const handlePrevious = () => {
    setSelectedIndex((previous) => Math.max(0, previous - 1));
  };

  const handleRandom = () => {
    if (!filteredQuestions.length) return;
    setSelectedIndex(Math.floor(Math.random() * filteredQuestions.length));
  };

  return (
    <div className="min-h-screen bg-[#050816] p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
          <div className="relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />
            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  BEP Practice Engine
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  Practice
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  Subject-wise practice, weak topic focus, and quick revision flow for daily study.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  Protected
                </Badge>
                <Badge variant="premium">
                  <Flame className="mr-1 h-3.5 w-3.5" />
                  Smart Practice
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Questions"
            value={stats.total}
            icon={<BookOpen className="h-5 w-5" />}
            accent="cyan"
            note="Available practice items"
          />
          <StatCard
            title="Filtered"
            value={stats.filtered}
            icon={<Filter className="h-5 w-5" />}
            accent="emerald"
            note="After current filters"
          />
          <StatCard
            title="Attempts"
            value={stats.attempts}
            icon={<Target className="h-5 w-5" />}
            accent="amber"
            note="Answered in this session"
          />
          <StatCard
            title="Weak Topics"
            value={stats.weakCount}
            icon={<Flame className="h-5 w-5" />}
            accent="fuchsia"
            note="Needs more review"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <aside className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <SectionTitle
                icon={<Filter className="h-4 w-4" />}
                title="Filters"
                description="Choose subject, difficulty, and mode to shape your practice session."
              />

              <div className="space-y-4">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search practice..."
                  leftIcon={<Search className="h-4 w-4" />}
                />

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
                    Subject
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {subjectOptions.map((item) => (
                      <ToolbarButton
                        key={item}
                        label={item}
                        active={subject === item}
                        icon={<BookOpen className="h-4 w-4" />}
                        onClick={() => {
                          setSubject(item);
                          setSelectedIndex(0);
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
                    Difficulty
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {difficultyOptions.map((item) => (
                      <ToolbarButton
                        key={item}
                        label={item}
                        active={difficulty === item}
                        icon={<Target className="h-4 w-4" />}
                        onClick={() => {
                          setDifficulty(item);
                          setSelectedIndex(0);
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
                    Mode
                  </p>
                  <div className="grid gap-3 md:grid-cols-3">
                    {modeOptions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMode(item.id)}
                        className={[
                          'rounded-2xl border px-4 py-3 text-sm font-semibold transition',
                          mode === item.id
                            ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                            : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
                        ].join(' ')}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={resetFilters}>
                    Reset
                  </Button>
                  <Button onClick={handleRandom} leftIcon={<Wand2 className="h-4 w-4" />}>
                    Random question
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <SectionTitle
                icon={<TimerReset className="h-4 w-4" />}
                title="Session controls"
                description="Pause, resume, or quickly move across the practice queue."
              />

              <div className="grid gap-3 md:grid-cols-2">
                <ToolbarButton
                  label={paused ? 'Resume' : 'Pause'}
                  active={paused}
                  icon={paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  onClick={() => setPaused((previous) => !previous)}
                />
                <ToolbarButton
                  label="Previous"
                  icon={<ChevronLeft className="h-4 w-4" />}
                  onClick={handlePrevious}
                />
                <ToolbarButton
                  label="Next"
                  icon={<ChevronRight className="h-4 w-4" />}
                  onClick={handleNext}
                />
                <ToolbarButton
                  label="Reset answers"
                  icon={<RefreshCw className="h-4 w-4" />}
                  onClick={() => setAnswers({})}
                />
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
                <Flame className="h-4 w-4" />
                <span className="text-sm font-semibold">Weak topics</span>
              </div>

              <div className="space-y-3">
                {weakTopics.map((item) => (
                  <WeakTopicCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-100" />
              </div>
            ) : filteredQuestions.length > 0 && currentQuestion ? (
              <>
                <QuestionCard
                  question={currentQuestion}
                  selectedAnswer={currentQuestion.type === 'mcq' ? currentAnswer : ''}
                  writtenAnswer={currentQuestion.type === 'written' ? currentAnswer : ''}
                  onSelectAnswer={(optionId) => updateAnswer(currentQuestion.id, optionId)}
                  onChangeWritten={(value) => updateAnswer(currentQuestion.id, value)}
                  onToggleBookmark={toggleBookmark}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                    <SectionTitle
                      icon={<Clock3 className="h-4 w-4" />}
                      title="Progress overview"
                      description="How far you have moved through the current filtered set."
                    />

                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm text-white/50">
                          <span>Completion</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-[24px] border border-white/10 bg-[#08111F]/75 p-4">
                          <div className="text-xs uppercase tracking-wider text-white/40">Answered</div>
                          <div className="mt-2 text-2xl font-black text-white">{stats.attempts}</div>
                        </div>
                        <div className="rounded-[24px] border border-white/10 bg-[#08111F]/75 p-4">
                          <div className="text-xs uppercase tracking-wider text-white/40">Saved</div>
                          <div className="mt-2 text-2xl font-black text-white">{stats.bookmarked}</div>
                        </div>
                        <div className="rounded-[24px] border border-white/10 bg-[#08111F]/75 p-4">
                          <div className="text-xs uppercase tracking-wider text-white/40">Left</div>
                          <div className="mt-2 text-2xl font-black text-white">
                            {Math.max(filteredQuestions.length - stats.attempts, 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                    <div className="mb-4 flex items-center gap-2 text-cyan-100">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-sm font-semibold">Practice insights</span>
                    </div>

                    <div className="space-y-3">
                      <InsightRow label="Mode" value={mode} />
                      <InsightRow label="Current subject" value={subject} />
                      <InsightRow label="Current difficulty" value={difficulty} />
                      <InsightRow label="Loading status" value={loading ? 'Loading' : 'Ready'} />
                    </div>

                    <div className="mt-5 rounded-[26px] border border-cyan-400/15 bg-cyan-400/10 p-4">
                      <p className="text-sm leading-7 text-white/75">
                        Practice hard, review mistakes, and keep your weak topics in rotation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-cyan-100">
                        <Trophy className="h-4 w-4" />
                        <span className="text-sm font-semibold">Session summary</span>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-white/55">
                        Based on the currently filtered practice queue.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="success">Focus</Badge>
                      <Badge variant="premium">Smart revision</Badge>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <StatCard
                      title="Accuracy hint"
                      value={`${Math.max(70, 100 - stats.weakCount * 8)}%`}
                      icon={<BadgeCheck className="h-5 w-5" />}
                      accent="emerald"
                      note="Demo session estimate"
                    />
                    <StatCard
                      title="Strong topics"
                      value={Math.max(stats.total - stats.weakCount, 0)}
                      icon={<CheckCircle2 className="h-5 w-5" />}
                      accent="cyan"
                      note="Not flagged as weak"
                    />
                    <StatCard
                      title="Focus time"
                      value="45m"
                      icon={<Clock3 className="h-5 w-5" />}
                      accent="amber"
                      note="Recommended daily block"
                    />
                    <StatCard
                      title="Next goal"
                      value="+5%"
                      icon={<Flame className="h-5 w-5" />}
                      accent="fuchsia"
                      note="Target accuracy boost"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[32px] border border-dashed border-white/10 bg-white/[0.04] backdrop-blur-xl">
                <XCircle className="h-12 w-12 text-white/30" />
                <h3 className="mt-4 text-2xl font-bold text-white">No practice questions found</h3>
                <p className="mt-3 max-w-lg text-center text-sm leading-7 text-white/55">
                  Filters reset করুন বা search term পরিবর্তন করুন।
                </p>
                <div className="mt-5">
                  <Button onClick={resetFilters}>Reset filters</Button>
                </div>
              </div>
            )}
          </main>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-100">
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm font-semibold">Practice shortcuts</span>
              </div>
              <p className="mt-2 text-sm leading-7 text-white/55">
                দ্রুত revision, weak topic review, and timed practice on your next session.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">MCQ + Written</Badge>
              <Badge variant="success">Weak topic aware</Badge>
              <Badge variant="premium">BEP study flow</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-sm text-white/60">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}
