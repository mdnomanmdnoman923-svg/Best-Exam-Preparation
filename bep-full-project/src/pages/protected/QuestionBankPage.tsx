// bep-full-project/src/pages/protected/QuestionBankPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Crown,
  Filter,
  Flag,
  Layers3,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Wand2,
  X,
  XCircle,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type QuestionType = 'mcq' | 'written' | 'cq';
type QuestionDifficulty = 'easy' | 'medium' | 'hard';
type QuestionStatus = 'draft' | 'published' | 'archived';

interface QuestionOption {
  id: string;
  label: string;
  value: string;
  isCorrect?: boolean;
}

interface QuestionBankItem {
  id: string;
  subject: string;
  chapter: string;
  title: string;
  question: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  marks: number;
  tags: string[];
  options?: QuestionOption[];
  answer?: string;
  explanation?: string;
  hint?: string;
  premium?: boolean;
  featured?: boolean;
  bookmarked?: boolean;
  flagged?: boolean;
  createdAt: string;
  updatedAt: string;
}

const seedQuestions: QuestionBankItem[] = [
  {
    id: 'qb-1',
    subject: 'Physics',
    chapter: 'Motion and Force',
    title: 'Speed formula',
    question: 'A body covers 60 m in 12 s. What is its speed?',
    type: 'mcq',
    difficulty: 'easy',
    status: 'published',
    marks: 2,
    tags: ['speed', 'motion', 'formula'],
    options: [
      { id: 'a', label: 'A', value: '3 m/s', isCorrect: false },
      { id: 'b', label: 'B', value: '4 m/s', isCorrect: false },
      { id: 'c', label: 'C', value: '5 m/s', isCorrect: true },
      { id: 'd', label: 'D', value: '6 m/s', isCorrect: false },
    ],
    answer: '5 m/s',
    explanation: 'Speed = distance ÷ time = 60 ÷ 12 = 5 m/s.',
    hint: 'Use the basic speed formula.',
    premium: false,
    featured: true,
    bookmarked: true,
    flagged: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'qb-2',
    subject: 'Mathematics',
    chapter: 'Linear Equation',
    title: 'Solve for x',
    question: 'Solve: 2x + 7 = 19',
    type: 'written',
    difficulty: 'easy',
    status: 'published',
    marks: 3,
    tags: ['algebra', 'equation'],
    answer: 'x = 6',
    explanation: 'Subtract 7 from both sides, then divide by 2.',
    hint: 'First isolate x term.',
    premium: false,
    featured: false,
    bookmarked: false,
    flagged: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'qb-3',
    subject: 'Chemistry',
    chapter: 'Atomic Structure',
    title: 'Atomic number',
    question: 'What does the atomic number of an element represent?',
    type: 'mcq',
    difficulty: 'medium',
    status: 'published',
    marks: 2,
    tags: ['atoms', 'nucleus', 'concept'],
    options: [
      { id: 'a', label: 'A', value: 'Number of protons', isCorrect: true },
      { id: 'b', label: 'B', value: 'Number of neutrons', isCorrect: false },
      { id: 'c', label: 'C', value: 'Number of electrons + neutrons', isCorrect: false },
      { id: 'd', label: 'D', value: 'Mass number', isCorrect: false },
    ],
    answer: 'Number of protons',
    explanation: 'Atomic number is the number of protons in the nucleus.',
    hint: 'Think about nucleus composition.',
    premium: true,
    featured: false,
    bookmarked: false,
    flagged: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'qb-4',
    subject: 'English',
    chapter: 'Grammar',
    title: 'Voice change',
    question: 'Convert into passive voice: "The boy kicks the ball."',
    type: 'written',
    difficulty: 'medium',
    status: 'draft',
    marks: 4,
    tags: ['grammar', 'voice', 'transformation'],
    answer: 'The ball is kicked by the boy.',
    explanation: 'The object becomes the subject in passive voice.',
    hint: 'Object first, then auxiliary + past participle.',
    premium: false,
    featured: false,
    bookmarked: true,
    flagged: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'qb-5',
    subject: 'Biology',
    chapter: 'Photosynthesis',
    title: 'Main site',
    question: 'Where does photosynthesis mainly take place in a plant?',
    type: 'mcq',
    difficulty: 'easy',
    status: 'published',
    marks: 2,
    tags: ['biology', 'plants'],
    options: [
      { id: 'a', label: 'A', value: 'Roots', isCorrect: false },
      { id: 'b', label: 'B', value: 'Stem', isCorrect: false },
      { id: 'c', label: 'C', value: 'Leaves', isCorrect: true },
      { id: 'd', label: 'D', value: 'Flowers', isCorrect: false },
    ],
    answer: 'Leaves',
    explanation: 'Leaves contain chloroplasts and are the primary site of photosynthesis.',
    hint: 'Look for the green part of the plant.',
    premium: false,
    featured: true,
    bookmarked: false,
    flagged: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'qb-6',
    subject: 'Physics',
    chapter: 'Newton Laws',
    title: 'Net force',
    question: 'What happens when the net force on a body is zero?',
    type: 'cq',
    difficulty: 'hard',
    status: 'published',
    marks: 5,
    tags: ['force', 'motion', 'law'],
    answer: 'The body remains in its current state of rest or uniform motion.',
    explanation: 'Zero net force means no acceleration.',
    hint: 'Think about equilibrium.',
    premium: true,
    featured: false,
    bookmarked: false,
    flagged: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const subjectOptions = ['All', 'Physics', 'Mathematics', 'Chemistry', 'Biology', 'English'] as const;
const difficultyOptions = ['All', 'easy', 'medium', 'hard'] as const;
const statusOptions = ['All', 'draft', 'published', 'archived'] as const;
const typeOptions = ['All', 'mcq', 'written', 'cq'] as const;

function getDifficultyVariant(difficulty: QuestionDifficulty) {
  if (difficulty === 'easy') return 'success' as const;
  if (difficulty === 'medium') return 'warning' as const;
  return 'danger' as const;
}

function getStatusVariant(status: QuestionStatus) {
  if (status === 'published') return 'success' as const;
  if (status === 'draft') return 'warning' as const;
  return 'secondary' as const;
}

function getTypeVariant(type: QuestionType) {
  if (type === 'mcq') return 'premium' as const;
  if (type === 'written') return 'secondary' as const;
  return 'success' as const;
}

function formatRelativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
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
  item,
  onBookmark,
  onFlag,
  onView,
}: {
  item: QuestionBankItem;
  onBookmark: (id: string) => void;
  onFlag: (id: string) => void;
  onView: (item: QuestionBankItem) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant={getTypeVariant(item.type)}>{item.type}</Badge>
            <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
            <Badge variant={getDifficultyVariant(item.difficulty)}>{item.difficulty}</Badge>
            {item.premium ? <Badge variant="premium">Premium</Badge> : null}
            {item.featured ? <Badge variant="success">Featured</Badge> : null}
            {item.bookmarked ? <Badge variant="secondary">Saved</Badge> : null}
            {item.flagged ? <Badge variant="warning">Flagged</Badge> : null}
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-white">{item.title}</h3>

          <p className="mt-3 text-sm leading-7 text-white/65">{item.question}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan-100" />
              {item.subject}
            </div>
            <div className="flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-emerald-100" />
              {item.chapter}
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-fuchsia-100" />
              {item.marks} marks
            </div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-amber-100" />
              {formatRelativeTime(item.createdAt)}
            </div>
          </div>

          {item.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 xl:min-w-[220px]">
          <Button variant="secondary" onClick={() => onView(item)} leftIcon={<ArrowRight className="h-4 w-4" />}>
            View
          </Button>

          <Button
            variant="secondary"
            onClick={() => onBookmark(item.id)}
            leftIcon={item.bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          >
            {item.bookmarked ? 'Unsave' : 'Save'}
          </Button>

          <Button
            variant="secondary"
            onClick={() => onFlag(item.id)}
            leftIcon={<Flag className="h-4 w-4" />}
          >
            {item.flagged ? 'Unflag' : 'Flag'}
          </Button>

          <Button leftIcon={<BadgeCheck className="h-4 w-4" />}>
            Edit
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <MiniStat label="Last updated" value={formatRelativeTime(item.updatedAt)} />
        <MiniStat label="Answer" value={item.answer || '--'} />
        <MiniStat label="Hint" value={item.hint ? 'Available' : 'No hint'} />
        <MiniStat label="Explanation" value={item.explanation ? 'Available' : 'No explanation'} />
      </div>
    </motion.article>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#08111F]/70 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">{label}</div>
      <div className="mt-1 text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full border px-4 py-2 text-sm font-semibold transition',
        active
          ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
          : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function InsightRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-sm text-white/60">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function DetailBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">{title}</p>
      <div className="mt-3 text-sm leading-7 text-white/70">{children}</div>
    </div>
  );
}

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<QuestionBankItem[]>(seedQuestions);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState<(typeof subjectOptions)[number]>('All');
  const [difficulty, setDifficulty] = useState<(typeof difficultyOptions)[number]>('All');
  const [status, setStatus] = useState<(typeof statusOptions)[number]>('All');
  const [type, setType] = useState<(typeof typeOptions)[number]>('All');
  const [loading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<QuestionBankItem | null>(null);

  const stats = useMemo(() => {
    const total = questions.length;
    const published = questions.filter((item) => item.status === 'published').length;
    const premium = questions.filter((item) => item.premium).length;
    const featured = questions.filter((item) => item.featured).length;
    const bookmarked = questions.filter((item) => item.bookmarked).length;
    const flagged = questions.filter((item) => item.flagged).length;
    const avgMarks = total ? Math.round(questions.reduce((sum, item) => sum + item.marks, 0) / total) : 0;

    return {
      total,
      published,
      premium,
      featured,
      bookmarked,
      flagged,
      avgMarks,
    };
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return questions
      .filter((item) => {
        const matchesSearch =
          !query ||
          [
            item.title,
            item.question,
            item.subject,
            item.chapter,
            item.tags.join(' '),
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query);

        const matchesSubject = subject === 'All' || item.subject === subject;
        const matchesDifficulty = difficulty === 'All' || item.difficulty === difficulty;
        const matchesStatus = status === 'All' || item.status === status;
        const matchesType = type === 'All' || item.type === type;

        return matchesSearch && matchesSubject && matchesDifficulty && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        const rank = (item: QuestionBankItem) => {
          let score = 0;
          if (item.status === 'published') score += 10;
          if (item.featured) score += 5;
          if (item.bookmarked) score += 3;
          if (item.premium) score += 2;
          return score;
        };

        return rank(b) - rank(a);
      });
  }, [difficulty, questions, search, status, subject, type]);

  const weakTopics = useMemo(() => {
    const bySubject = new Map<string, { subject: string; count: number; flagged: number }>();

    questions.forEach((item) => {
      const current = bySubject.get(item.subject) || { subject: item.subject, count: 0, flagged: 0 };
      current.count += 1;
      if (item.flagged) current.flagged += 1;
      bySubject.set(item.subject, current);
    });

    return Array.from(bySubject.values()).sort((a, b) => b.flagged - a.flagged);
  }, [questions]);

  const toggleBookmark = (id: string) => {
    setQuestions((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, bookmarked: !item.bookmarked, updatedAt: new Date().toISOString() } : item,
      ),
    );
  };

  const toggleFlag = (id: string) => {
    setQuestions((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, flagged: !item.flagged, updatedAt: new Date().toISOString() } : item,
      ),
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSubject('All');
    setDifficulty('All');
    setStatus('All');
    setType('All');
  };

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
                  BEP Question Library
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  Question Bank
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  Subject, chapter, difficulty, and status অনুযায়ী প্রশ্নগুলো explore, filter, and manage করুন।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  Secure Library
                </Badge>
                <Badge variant="premium">
                  <Crown className="mr-1 h-3.5 w-3.5" />
                  Premium Questions
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Questions"
            value={stats.total}
            icon={<BookOpen className="h-5 w-5" />}
            accent="cyan"
            note="All available items"
          />
          <StatCard
            title="Published"
            value={stats.published}
            icon={<CheckCircle2 className="h-5 w-5" />}
            accent="emerald"
            note="Visible to learners"
          />
          <StatCard
            title="Bookmarked"
            value={stats.bookmarked}
            icon={<BookmarkCheck className="h-5 w-5" />}
            accent="amber"
            note="Saved for review"
          />
          <StatCard
            title="Flagged"
            value={stats.flagged}
            icon={<Flag className="h-5 w-5" />}
            accent="fuchsia"
            note="Needs moderation"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <SectionTitle
              icon={<Filter className="h-4 w-4" />}
              title="Filters"
              description="Search by keywords and narrow the library by subject, difficulty, type, and status."
            />

            <div className="space-y-4">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search question bank..."
                leftIcon={<Search className="h-4 w-4" />}
              />

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">Subject</p>
                <div className="flex flex-wrap gap-2">
                  {subjectOptions.map((item) => (
                    <FilterPill key={item} label={item} active={subject === item} onClick={() => setSubject(item)} />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">Difficulty</p>
                <div className="flex flex-wrap gap-2">
                  {difficultyOptions.map((item) => (
                    <FilterPill
                      key={item}
                      label={item}
                      active={difficulty === item}
                      onClick={() => setDifficulty(item)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">Status</p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((item) => (
                    <FilterPill key={item} label={item} active={status === item} onClick={() => setStatus(item)} />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">Type</p>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map((item) => (
                    <FilterPill key={item} label={item} active={type === item} onClick={() => setType(item)} />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={clearFilters}>
                  Reset filters
                </Button>
                <Button leftIcon={<Wand2 className="h-4 w-4" />}>Create question</Button>
              </div>
            </div>

            <div className="mt-6 rounded-[26px] border border-cyan-400/15 bg-cyan-400/10 p-4">
              <p className="text-sm leading-7 text-white/75">
                Use this bank to organize practice content, moderate flagged items, and keep premium materials clean.
              </p>
            </div>

            <div className="mt-6 rounded-[30px] border border-white/10 bg-[#08111F]/75 p-5">
              <div className="mb-4 flex items-center gap-2 text-cyan-100">
                <Trophy className="h-4 w-4" />
                <span className="text-sm font-semibold">Library insights</span>
              </div>

              <div className="grid gap-3">
                <InsightRow label="Average marks" value={stats.avgMarks} />
                <InsightRow label="Premium questions" value={stats.premium} />
                <InsightRow label="Featured questions" value={stats.featured} />
                <InsightRow label="Flagged questions" value={stats.flagged} />
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-100">
                  <Layers3 className="h-4 w-4" />
                  <span className="text-sm font-semibold">Question list</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/55">
                  Sorted by quality signals and current status.
                </p>
              </div>

              <Badge variant="secondary">{filteredQuestions.length} items</Badge>
            </div>

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-100" />
              </div>
            ) : filteredQuestions.length > 0 ? (
              <div className="space-y-4">
                {filteredQuestions.map((item) => (
                  <QuestionCard
                    key={item.id}
                    item={item}
                    onBookmark={toggleBookmark}
                    onFlag={toggleFlag}
                    onView={setSelectedItem}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10">
                <XCircle className="h-12 w-12 text-white/30" />
                <h3 className="mt-4 text-xl font-bold">No questions found</h3>
                <p className="mt-2 text-sm text-white/55">Adjust filters or clear search.</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Average Marks"
            value={stats.avgMarks}
            icon={<Target className="h-5 w-5" />}
            accent="emerald"
            note="Per question average"
          />
          <StatCard
            title="Featured"
            value={stats.featured}
            icon={<Star className="h-5 w-5" />}
            accent="amber"
            note="Highlighted content"
          />
          <StatCard
            title="Premium"
            value={stats.premium}
            icon={<Crown className="h-5 w-5" />}
            accent="fuchsia"
            note="Premium access items"
          />
          <StatCard
            title="Flagged"
            value={stats.flagged}
            icon={<Flag className="h-5 w-5" />}
            accent="cyan"
            note="Needs moderation review"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <SectionTitle
              icon={<Flame className="h-4 w-4" />}
              title="Weak subject signals"
              description="Subjects with more flagged items can need review or more practice coverage."
            />

            <div className="space-y-3">
              {weakTopics.map((item) => (
                <div key={item.subject} className="rounded-[26px] border border-white/10 bg-[#08111F]/75 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{item.subject}</h4>
                        <Badge variant="secondary">{formatNumber(item.count)} items</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/55">
                        {item.flagged > 0 ? `${item.flagged} flagged question(s)` : 'No flagged questions'}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-right">
                      <div className="text-xs uppercase tracking-wider text-white/40">Focus</div>
                      <div className="mt-1 text-lg font-bold text-white">
                        {item.flagged > 0 ? 'Review' : 'Stable'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-100">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-sm font-semibold">Question details</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/55">
                  Select a question to inspect its answer, explanation, and moderation status.
                </p>
              </div>

              {selectedItem ? <Badge variant="success">Selected</Badge> : <Badge variant="secondary">None</Badge>}
            </div>

            {selectedItem ? (
              <div className="space-y-4">
                <DetailBlock title="Title">{selectedItem.title}</DetailBlock>
                <DetailBlock title="Question">{selectedItem.question}</DetailBlock>
                <DetailBlock title="Answer">{selectedItem.answer || '--'}</DetailBlock>
                <DetailBlock title="Explanation">{selectedItem.explanation || '--'}</DetailBlock>
                <DetailBlock title="Hint">{selectedItem.hint || '--'}</DetailBlock>

                <div className="grid gap-3 md:grid-cols-2">
                  <InsightRow label="Subject" value={selectedItem.subject} />
                  <InsightRow label="Chapter" value={selectedItem.chapter} />
                  <InsightRow label="Difficulty" value={selectedItem.difficulty} />
                  <InsightRow label="Status" value={selectedItem.status} />
                </div>

                {selectedItem.options?.length ? (
                  <div className="rounded-[26px] border border-white/10 bg-[#08111F]/75 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Options</p>
                    <div className="space-y-3">
                      {selectedItem.options.map((option) => (
                        <div
                          key={option.id}
                          className={[
                            'flex items-center justify-between gap-3 rounded-2xl border px-4 py-3',
                            option.isCorrect ? 'border-emerald-400/15 bg-emerald-400/10' : 'border-white/10 bg-white/[0.04]',
                          ].join(' ')}
                        >
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-xs font-bold text-cyan-100">
                              {option.label}
                            </span>
                            <span className="text-sm text-white/75">{option.value}</span>
                          </div>
                          {option.isCorrect ? <CheckCircle2 className="h-4 w-4 text-emerald-100" /> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <Button leftIcon={<BadgeCheck className="h-4 w-4" />}>Edit question</Button>
                  <Button variant="secondary" onClick={() => toggleBookmark(selectedItem.id)}>
                    {selectedItem.bookmarked ? 'Unsave' : 'Save'}
                  </Button>
                  <Button variant="secondary" onClick={() => toggleFlag(selectedItem.id)}>
                    {selectedItem.flagged ? 'Unflag' : 'Flag'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[340px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10">
                <BookOpen className="h-12 w-12 text-white/30" />
                <h3 className="mt-4 text-xl font-bold">No question selected</h3>
                <p className="mt-2 text-sm text-white/55">Use the View button on any question card.</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-100">
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm font-semibold">Question bank summary</span>
              </div>
              <p className="mt-2 text-sm leading-7 text-white/55">
                Keep the library clean, sorted, and consistent so practice and exam content stays sharp.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="success">Moderated</Badge>
              <Badge variant="premium">Premium aware</Badge>
              <Badge variant="secondary">Searchable</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
