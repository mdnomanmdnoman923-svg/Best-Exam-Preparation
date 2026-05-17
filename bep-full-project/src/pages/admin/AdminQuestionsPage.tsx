// bep-full-project/src/pages/admin/AdminQuestionsPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Crown,
  Edit3,
  Eye,
  Filter,
  Flag,
  Layers3,
  Loader2,
  Lock,
  Plus,
  Search,
  Sparkles,
  Star,
  Target,
  Trash2,
  Wand2,
  X,
  XCircle,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type QuestionType = 'mcq' | 'sq' | 'cq';
type QuestionDifficulty = 'easy' | 'medium' | 'hard';
type QuestionStatus = 'draft' | 'published' | 'archived';

interface QuestionOption {
  id: string;
  label: string;
  value: string;
  isCorrect?: boolean;
}

interface AdminQuestionItem {
  id: string;
  subjectId: string;
  subjectName: string;
  chapterId?: string;
  chapterName?: string;
  title?: string;
  question: string;
  explanation?: string;
  hint?: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  order: number;
  points: number;
  premium: boolean;
  locked: boolean;
  featured: boolean;
  bookmarked: boolean;
  flagged: boolean;
  imageUrl?: string;
  tags: string[];
  options: QuestionOption[];
  correctAnswer?: string;
  answerKey?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface QuestionFormState {
  subjectId: string;
  subjectName: string;
  chapterName: string;
  title: string;
  question: string;
  explanation: string;
  hint: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  order: number;
  points: number;
  premium: boolean;
  locked: boolean;
  featured: boolean;
  bookmarked: boolean;
  flagged: boolean;
  imageUrl: string;
  tags: string;
  options: QuestionOption[];
  correctAnswer: string;
  answerKey: string;
}

const subjectOptions = [
  { id: 'sub-math', name: 'Mathematics' },
  { id: 'sub-physics', name: 'Physics' },
  { id: 'sub-chemistry', name: 'Chemistry' },
  { id: 'sub-biology', name: 'Biology' },
  { id: 'sub-english', name: 'English' },
  { id: 'sub-bangla', name: 'Bangla' },
];

const seedQuestions: AdminQuestionItem[] = [
  {
    id: 'q-1',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    chapterId: 'ch-1',
    chapterName: 'Algebra Basics',
    title: 'Linear Equation',
    question: 'If 2x + 5 = 17, what is the value of x?',
    explanation: 'Subtract 5 from both sides, then divide by 2.',
    hint: 'First isolate the x term.',
    type: 'mcq',
    difficulty: 'easy',
    status: 'published',
    order: 1,
    points: 2,
    premium: false,
    locked: false,
    featured: true,
    bookmarked: true,
    flagged: false,
    tags: ['algebra', 'linear-equation'],
    options: [
      { id: 'a', label: 'A', value: '4', isCorrect: false },
      { id: 'b', label: 'B', value: '5', isCorrect: false },
      { id: 'c', label: 'C', value: '6', isCorrect: true },
      { id: 'd', label: 'D', value: '7', isCorrect: false },
    ],
    correctAnswer: '6',
    answerKey: '6',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'q-2',
    subjectId: 'sub-physics',
    subjectName: 'Physics',
    chapterId: 'ch-2',
    chapterName: 'Motion',
    title: 'Speed Formula',
    question: 'Write the formula of speed in terms of distance and time.',
    explanation: 'Speed is the ratio of distance covered to time taken.',
    hint: 'Use the basic motion relation.',
    type: 'sq',
    difficulty: 'medium',
    status: 'draft',
    order: 2,
    points: 3,
    premium: true,
    locked: false,
    featured: false,
    bookmarked: false,
    flagged: true,
    tags: ['motion', 'speed'],
    options: [],
    correctAnswer: 'speed = distance / time',
    answerKey: 'speed = distance / time',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'q-3',
    subjectId: 'sub-chemistry',
    subjectName: 'Chemistry',
    chapterId: 'ch-3',
    chapterName: 'Atomic Structure',
    title: 'Atomic Number',
    question: 'What does atomic number represent?',
    explanation: 'It represents the number of protons in the nucleus.',
    hint: 'Think of nuclear composition.',
    type: 'cq',
    difficulty: 'hard',
    status: 'published',
    order: 3,
    points: 5,
    premium: true,
    locked: true,
    featured: false,
    bookmarked: false,
    flagged: false,
    tags: ['atoms', 'nucleus'],
    options: [],
    correctAnswer: 'Number of protons in the nucleus',
    answerKey: 'Number of protons in the nucleus',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialForm: QuestionFormState = {
  subjectId: '',
  subjectName: '',
  chapterName: '',
  title: '',
  question: '',
  explanation: '',
  hint: '',
  type: 'mcq',
  difficulty: 'medium',
  status: 'draft',
  order: 1,
  points: 1,
  premium: false,
  locked: false,
  featured: false,
  bookmarked: false,
  flagged: false,
  imageUrl: '',
  tags: '',
  options: [
    { id: 'opt-a', label: 'A', value: '', isCorrect: false },
    { id: 'opt-b', label: 'B', value: '', isCorrect: false },
    { id: 'opt-c', label: 'C', value: '', isCorrect: false },
    { id: 'opt-d', label: 'D', value: '', isCorrect: false },
  ],
  correctAnswer: '',
  answerKey: '',
};

function typeLabel(type: QuestionType) {
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

function difficultyLabel(difficulty: QuestionDifficulty) {
  switch (difficulty) {
    case 'easy':
      return 'Easy';
    case 'medium':
      return 'Medium';
    case 'hard':
      return 'Hard';
    default:
      return 'Medium';
  }
}

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u0980-\u09FF]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function createQuestionId() {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function buildOptionLabels(options: QuestionOption[]) {
  return options.map((option, index) => ({
    ...option,
    label: String.fromCharCode(65 + index),
  }));
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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block text-sm text-white/60">{children}</label>;
}

function getStatusVariant(status: QuestionStatus) {
  if (status === 'published') return 'success' as const;
  if (status === 'draft') return 'warning' as const;
  return 'danger' as const;
}

function OptionInputRow({
  option,
  onChange,
  onRemove,
  onMarkCorrect,
  disabled,
}: {
  option: QuestionOption;
  onChange: (patch: Partial<QuestionOption>) => void;
  onRemove: () => void;
  onMarkCorrect: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#08111F]/75 p-4">
      <div className="grid gap-3 md:grid-cols-[100px_1fr]">
        <Input
          value={option.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Label"
          disabled={disabled}
        />
        <Input
          value={option.value}
          onChange={(e) => onChange({ value: e.target.value })}
          placeholder="Option text"
          disabled={disabled}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-white/60">
          <input
            type="checkbox"
            checked={Boolean(option.isCorrect)}
            onChange={(e) => onMarkCorrect(e.target.checked)}
            disabled={disabled}
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400"
          />
          Correct answer
        </label>

        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-2xl border border-red-400/15 bg-red-400/10 px-3 py-2 text-sm font-medium text-red-100 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
      </div>
    </div>
  );
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<AdminQuestionItem[]>(seedQuestions);
  const [loading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<QuestionType | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<QuestionDifficulty | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<QuestionStatus | 'all'>('all');
  const [premiumFilter, setPremiumFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [lockedFilter, setLockedFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<AdminQuestionItem | null>(null);
  const [form, setForm] = useState<QuestionFormState>(initialForm);

  const stats = useMemo(() => {
    const total = questions.length;
    const published = questions.filter((item) => item.status === 'published').length;
    const draft = questions.filter((item) => item.status === 'draft').length;
    const archived = questions.filter((item) => item.status === 'archived').length;
    const premium = questions.filter((item) => item.premium).length;
    const featured = questions.filter((item) => item.featured).length;
    const locked = questions.filter((item) => item.locked).length;
    const flagged = questions.filter((item) => item.flagged).length;

    return { total, published, draft, archived, premium, featured, locked, flagged };
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
            item.explanation,
            item.hint,
            item.subjectName,
            item.chapterName,
            item.tags.join(' '),
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query);

        const matchesSubject = subjectFilter === 'all' || item.subjectId === subjectFilter;
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        const matchesDifficulty = difficultyFilter === 'all' || item.difficulty === difficultyFilter;
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesPremium =
          premiumFilter === 'all' || (premiumFilter === 'yes' ? item.premium : !item.premium);
        const matchesFeatured =
          featuredFilter === 'all' || (featuredFilter === 'yes' ? item.featured : !item.featured);
        const matchesLocked =
          lockedFilter === 'all' || (lockedFilter === 'yes' ? item.locked : !item.locked);

        return (
          matchesSearch &&
          matchesSubject &&
          matchesType &&
          matchesDifficulty &&
          matchesStatus &&
          matchesPremium &&
          matchesFeatured &&
          matchesLocked
        );
      })
      .sort((a, b) => a.order - b.order);
  }, [
    difficultyFilter,
    featuredFilter,
    lockedFilter,
    premiumFilter,
    questions,
    search,
    statusFilter,
    subjectFilter,
    typeFilter,
  ]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (question: AdminQuestionItem) => {
    setEditingId(question.id);
    setForm({
      subjectId: question.subjectId,
      subjectName: question.subjectName,
      chapterName: question.chapterName || '',
      title: question.title || '',
      question: question.question,
      explanation: question.explanation || '',
      hint: question.hint || '',
      type: question.type,
      difficulty: question.difficulty,
      status: question.status,
      order: question.order,
      points: question.points,
      premium: question.premium,
      locked: question.locked,
      featured: question.featured,
      bookmarked: question.bookmarked,
      flagged: question.flagged,
      imageUrl: question.imageUrl || '',
      tags: question.tags.join(', '),
      options:
        question.options.length > 0
          ? question.options.map((option) => ({ ...option }))
          : [...initialForm.options],
      correctAnswer: question.correctAnswer || '',
      answerKey: question.answerKey || '',
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.subjectName.trim() || !form.question.trim()) return;

    try {
      setSaving(true);
      const now = new Date().toISOString();

      const normalizedOptions = buildOptionLabels(
        form.type === 'mcq'
          ? form.options.filter((option) => option.value.trim().length > 0)
          : [],
      );

      const nextAnswer =
        form.correctAnswer.trim() ||
        form.answerKey.trim() ||
        normalizedOptions.find((option) => option.isCorrect)?.value ||
        '';

      const nextItem: AdminQuestionItem = {
        id: editingId || createQuestionId(),
        subjectId: form.subjectId || normalizeText(form.subjectName),
        subjectName: form.subjectName.trim(),
        chapterName: form.chapterName.trim(),
        title: form.title.trim(),
        question: form.question.trim(),
        explanation: form.explanation.trim(),
        hint: form.hint.trim(),
        type: form.type,
        difficulty: form.difficulty,
        status: form.status,
        order: Number(form.order) || 1,
        points: Number(form.points) || 1,
        premium: form.premium,
        locked: form.locked,
        featured: form.featured,
        bookmarked: form.bookmarked,
        flagged: form.flagged,
        imageUrl: form.imageUrl.trim(),
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        options: normalizedOptions,
        correctAnswer: nextAnswer,
        answerKey: nextAnswer,
        createdBy: 'admin',
        updatedBy: 'admin',
        createdAt: editingId ? questions.find((item) => item.id === editingId)?.createdAt : now,
        updatedAt: now,
      };

      setQuestions((previous) =>
        editingId
          ? previous.map((item) => (item.id === editingId ? nextItem : item))
          : [nextItem, ...previous],
      );

      closeForm();
    } finally {
      setSaving(false);
    }
  };

  const removeQuestion = (id: string) => {
    const confirmed = window.confirm('Delete this question?');
    if (!confirmed) return;
    setQuestions((previous) => previous.filter((item) => item.id !== id));
    if (selectedQuestion?.id === id) setSelectedQuestion(null);
  };

  const setStatus = (id: string, status: QuestionStatus) => {
    setQuestions((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  };

  const toggleFlag = (id: string) => {
    setQuestions((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              flagged: !item.flagged,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  };

  const togglePremium = (id: string) => {
    setQuestions((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              premium: !item.premium,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  };

  const toggleFeatured = (id: string) => {
    setQuestions((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              featured: !item.featured,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  };

  const toggleLocked = (id: string) => {
    setQuestions((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              locked: !item.locked,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  };

  const duplicateQuestion = (question: AdminQuestionItem) => {
    const now = new Date().toISOString();
    const copy: AdminQuestionItem = {
      ...question,
      id: createQuestionId(),
      title: `${question.title || 'Question'} Copy`,
      order: questions.length + 1,
      bookmarked: false,
      flagged: false,
      featured: false,
      locked: false,
      updatedAt: now,
      createdAt: now,
    };

    setQuestions((previous) => [copy, ...previous]);
  };

  const updateOption = (index: number, patch: Partial<QuestionOption>) => {
    setForm((previous) => ({
      ...previous,
      options: previous.options.map((option, currentIndex) =>
        currentIndex === index ? { ...option, ...patch } : option,
      ),
    }));
  };

  const removeOption = (index: number) => {
    setForm((previous) => ({
      ...previous,
      options: buildOptionLabels(previous.options.filter((_, currentIndex) => currentIndex !== index)),
    }));
  };

  const addOption = () => {
    setForm((previous) => ({
      ...previous,
      options: buildOptionLabels([
        ...previous.options,
        {
          id: `opt-${Date.now()}-${previous.options.length + 1}`,
          label: 'A',
          value: '',
          isCorrect: false,
        },
      ]),
    }));
  };

  const markCorrect = (index: number, checked: boolean) => {
    setForm((previous) => ({
      ...previous,
      options: previous.options.map((option, currentIndex) => ({
        ...option,
        isCorrect:
          previous.type === 'mcq'
            ? currentIndex === index
              ? checked
              : false
            : currentIndex === index
              ? checked
              : option.isCorrect,
      })),
    }));
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
                  BEP Admin Panel
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  Question Management
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  Question bank manage করুন, filters apply করুন, draft/published control করুন, এবং premium content organize করুন।
                </p>
              </div>

              <Button onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>
                Add Question
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Questions"
            value={stats.total}
            icon={<BookOpen className="h-5 w-5" />}
            accent="cyan"
            note="All question bank entries"
          />
          <StatCard
            title="Published"
            value={stats.published}
            icon={<CheckCircle2 className="h-5 w-5" />}
            accent="emerald"
            note="Visible to learners"
          />
          <StatCard
            title="Draft"
            value={stats.draft}
            icon={<Loader2 className="h-5 w-5" />}
            accent="amber"
            note="Pending publication"
          />
          <StatCard
            title="Flagged"
            value={stats.flagged}
            icon={<Flag className="h-5 w-5" />}
            accent="fuchsia"
            note="Needs moderator review"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-2 text-cyan-100">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-semibold">Filters</span>
            </div>

            <div className="space-y-4">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search question..."
                leftIcon={<Search className="h-4 w-4" />}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel>Subject</FieldLabel>
                  <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All Subjects</option>
                    {subjectOptions.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel>Status</FieldLabel>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as QuestionStatus | 'all')}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Type</FieldLabel>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as QuestionType | 'all')}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="mcq">MCQ</option>
                    <option value="sq">SQ</option>
                    <option value="cq">CQ</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Difficulty</FieldLabel>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value as QuestionDifficulty | 'all')}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Premium</FieldLabel>
                  <select
                    value={premiumFilter}
                    onChange={(e) => setPremiumFilter(e.target.value as 'all' | 'yes' | 'no')}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All</option>
                    <option value="yes">Premium only</option>
                    <option value="no">Free only</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Featured</FieldLabel>
                  <select
                    value={featuredFilter}
                    onChange={(e) => setFeaturedFilter(e.target.value as 'all' | 'yes' | 'no')}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All</option>
                    <option value="yes">Featured only</option>
                    <option value="no">Not featured</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Locked</FieldLabel>
                  <select
                    value={lockedFilter}
                    onChange={(e) => setLockedFilter(e.target.value as 'all' | 'yes' | 'no')}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All</option>
                    <option value="yes">Locked only</option>
                    <option value="no">Unlocked only</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
              <p className="text-sm leading-7 text-white/70">
                Filter combination help করে draft review, premium moderation, and content distribution দ্রুত manage করতে।
              </p>
            </div>

            <div className="mt-6 space-y-3 rounded-[26px] border border-white/10 bg-[#08111F]/75 p-5">
              <div className="flex items-center gap-2 text-cyan-100">
                <Target className="h-4 w-4" />
                <span className="text-sm font-semibold">Summary</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <MiniStat label="Featured" value={stats.featured} />
                <MiniStat label="Locked" value={stats.locked} />
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-100">
                <Layers3 className="h-4 w-4" />
                <span className="text-sm font-semibold">Questions</span>
              </div>

              <Badge variant="secondary">{filteredQuestions.length} items</Badge>
            </div>

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-100" />
              </div>
            ) : filteredQuestions.length > 0 ? (
              <div className="space-y-4">
                {filteredQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="rounded-[24px] border border-white/10 bg-[#08111F]/75 p-5"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <Badge variant="premium">{typeLabel(question.type)}</Badge>
                          <Badge variant={getStatusVariant(question.status)}>{question.status}</Badge>
                          <Badge variant={question.difficulty === 'easy' ? 'success' : question.difficulty === 'hard' ? 'danger' : 'warning'}>
                            {difficultyLabel(question.difficulty)}
                          </Badge>

                          {question.premium ? <Badge variant="premium">Premium</Badge> : null}
                          {question.featured ? <Badge variant="success">Featured</Badge> : null}
                          {question.locked ? <Badge variant="danger">Locked</Badge> : null}
                          {question.flagged ? <Badge variant="warning">Flagged</Badge> : null}
                        </div>

                        <h3 className="text-2xl font-bold text-white">{question.title || question.question.slice(0, 64)}</h3>

                        <p className="mt-2 text-sm leading-7 text-white/60">
                          {question.question}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/55">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-cyan-100" />
                            {question.subjectName}
                          </div>

                          {question.chapterName ? (
                            <div className="flex items-center gap-2">
                              <Layers3 className="h-4 w-4 text-emerald-100" />
                              {question.chapterName}
                            </div>
                          ) : null}

                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-fuchsia-100" />
                            {question.points} pts
                          </div>

                          <div className="flex items-center gap-2">
                            <Wand2 className="h-4 w-4 text-amber-100" />
                            Order #{question.order}
                          </div>
                        </div>

                        {question.tags.length > 0 ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {question.tags.slice(0, 5).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-2 xl:min-w-[220px]">
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedQuestion(question)}
                          leftIcon={<Eye className="h-4 w-4" />}
                        >
                          View
                        </Button>

                        <Button
                          variant="secondary"
                          onClick={() => openEdit(question)}
                          leftIcon={<Edit3 className="h-4 w-4" />}
                        >
                          Edit
                        </Button>

                        <Button
                          onClick={() => duplicateQuestion(question)}
                          leftIcon={<BadgeCheck className="h-4 w-4" />}
                        >
                          Duplicate
                        </Button>

                        <Button
                          variant="secondary"
                          onClick={() => setStatus(question.id, question.status === 'published' ? 'draft' : 'published')}
                          leftIcon={<CheckCircle2 className="h-4 w-4" />}
                        >
                          {question.status === 'published' ? 'Unpublish' : 'Publish'}
                        </Button>

                        <button
                          type="button"
                          onClick={() => togglePremium(question.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
                        >
                          <Crown className="h-4 w-4" />
                          {question.premium ? 'Unset Premium' : 'Set Premium'}
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleFeatured(question.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
                        >
                          <Star className="h-4 w-4" />
                          {question.featured ? 'Unfeature' : 'Feature'}
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleLocked(question.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
                        >
                          <Lock className="h-4 w-4" />
                          {question.locked ? 'Unlock' : 'Lock'}
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleFlag(question.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
                        >
                          <Flag className="h-4 w-4" />
                          {question.flagged ? 'Unflag' : 'Flag'}
                        </button>

                        <button
                          type="button"
                          onClick={() => removeQuestion(question.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/15 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-100 transition hover:bg-red-400/20"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10">
                <XCircle className="h-12 w-12 text-white/30" />
                <h3 className="mt-4 text-xl font-bold">No questions found</h3>
                <p className="mt-2 text-sm text-white/55">Adjust filters or add a new question.</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Archived"
            value={stats.archived}
            icon={<XCircle className="h-5 w-5" />}
            accent="amber"
            note="Hidden from learners"
          />
          <StatCard
            title="Premium"
            value={stats.premium}
            icon={<Crown className="h-5 w-5" />}
            accent="fuchsia"
            note="Monetized question content"
          />
          <StatCard
            title="Featured"
            value={stats.featured}
            icon={<Star className="h-5 w-5" />}
            accent="emerald"
            note="Highlighted practice items"
          />
          <StatCard
            title="Locked"
            value={stats.locked}
            icon={<Lock className="h-5 w-5" />}
            accent="cyan"
            note="Restricted content entries"
          />
        </div>

        {showForm ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
            <div className="w-full max-w-6xl rounded-[32px] border border-white/10 bg-[#08111F] p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black">
                    {editingId ? 'Edit Question' : 'Create Question'}
                  </h2>
                  <p className="mt-2 text-sm text-white/60">
                    Configure question type, options, and visibility settings.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-2xl border border-white/10 p-3 text-white/70 transition hover:bg-white/[0.05]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Subject</FieldLabel>
                    <select
                      value={form.subjectId}
                      onChange={(e) => {
                        const selected = subjectOptions.find((subject) => subject.id === e.target.value);
                        setForm((previous) => ({
                          ...previous,
                          subjectId: e.target.value,
                          subjectName: selected?.name || previous.subjectName,
                        }));
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                    >
                      <option value="">Select subject</option>
                      {subjectOptions.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    value={form.subjectName}
                    onChange={(e) => setForm((previous) => ({ ...previous, subjectName: e.target.value }))}
                    placeholder="Subject name"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={form.chapterName}
                    onChange={(e) => setForm((previous) => ({ ...previous, chapterName: e.target.value }))}
                    placeholder="Chapter name"
                  />
                  <Input
                    value={form.title}
                    onChange={(e) => setForm((previous) => ({ ...previous, title: e.target.value }))}
                    placeholder="Title"
                  />
                </div>

                <div>
                  <FieldLabel>Question</FieldLabel>
                  <textarea
                    value={form.question}
                    onChange={(e) => setForm((previous) => ({ ...previous, question: e.target.value }))}
                    rows={4}
                    placeholder="Write the question text..."
                    className="w-full rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <FieldLabel>Type</FieldLabel>
                    <select
                      value={form.type}
                      onChange={(e) => {
                        const nextType = e.target.value as QuestionType;
                        setForm((previous) => ({
                          ...previous,
                          type: nextType,
                          options:
                            nextType === 'mcq'
                              ? previous.options.length > 0
                                ? buildOptionLabels(previous.options)
                                : [...initialForm.options]
                              : [],
                        }));
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                    >
                      <option value="mcq">MCQ</option>
                      <option value="sq">SQ</option>
                      <option value="cq">CQ</option>
                    </select>
                  </div>

                  <div>
                    <FieldLabel>Difficulty</FieldLabel>
                    <select
                      value={form.difficulty}
                      onChange={(e) => setForm((previous) => ({ ...previous, difficulty: e.target.value as QuestionDifficulty }))}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <FieldLabel>Status</FieldLabel>
                    <select
                      value={form.status}
                      onChange={(e) => setForm((previous) => ({ ...previous, status: e.target.value as QuestionStatus }))}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <Input
                    type="number"
                    value={String(form.order)}
                    onChange={(e) => setForm((previous) => ({ ...previous, order: Number(e.target.value) || 1 }))}
                    placeholder="Order"
                  />
                  <Input
                    type="number"
                    value={String(form.points)}
                    onChange={(e) => setForm((previous) => ({ ...previous, points: Number(e.target.value) || 1 }))}
                    placeholder="Points"
                  />
                  <Input
                    value={form.imageUrl}
                    onChange={(e) => setForm((previous) => ({ ...previous, imageUrl: e.target.value }))}
                    placeholder="Image URL"
                  />
                  <Input
                    value={form.tags}
                    onChange={(e) => setForm((previous) => ({ ...previous, tags: e.target.value }))}
                    placeholder="Tags (comma separated)"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={form.correctAnswer}
                    onChange={(e) => setForm((previous) => ({ ...previous, correctAnswer: e.target.value }))}
                    placeholder="Correct answer"
                  />
                  <Input
                    value={form.answerKey}
                    onChange={(e) => setForm((previous) => ({ ...previous, answerKey: e.target.value }))}
                    placeholder="Answer key"
                  />
                </div>

                <div>
                  <FieldLabel>Explanation</FieldLabel>
                  <textarea
                    value={form.explanation}
                    onChange={(e) => setForm((previous) => ({ ...previous, explanation: e.target.value }))}
                    rows={3}
                    placeholder="Explain the answer..."
                    className="w-full rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div>
                  <FieldLabel>Hint</FieldLabel>
                  <textarea
                    value={form.hint}
                    onChange={(e) => setForm((previous) => ({ ...previous, hint: e.target.value }))}
                    rows={2}
                    placeholder="Short hint for learners..."
                    className="w-full rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  />
                </div>

                {form.type === 'mcq' ? (
                  <div className="space-y-4 rounded-[30px] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-cyan-100">
                          <Wand2 className="h-4 w-4" />
                          <span className="text-sm font-semibold">Options</span>
                        </div>
                        <p className="mt-2 text-sm leading-7 text-white/55">
                          MCQ option editor. Mark one correct option and keep the option list clean.
                        </p>
                      </div>

                      <Button type="button" variant="secondary" onClick={addOption} leftIcon={<Plus className="h-4 w-4" />}>
                        Add option
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {form.options.map((option, index) => (
                        <OptionInputRow
                          key={option.id}
                          option={option}
                          onChange={(patch) => updateOption(index, patch)}
                          onRemove={() => removeOption(index)}
                          onMarkCorrect={(checked) => markCorrect(index, checked)}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm">Premium</span>
                    <input
                      type="checkbox"
                      checked={form.premium}
                      onChange={(e) => setForm((previous) => ({ ...previous, premium: e.target.checked }))}
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm">Locked</span>
                    <input
                      type="checkbox"
                      checked={form.locked}
                      onChange={(e) => setForm((previous) => ({ ...previous, locked: e.target.checked }))}
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm">Featured</span>
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((previous) => ({ ...previous, featured: e.target.checked }))}
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm">Bookmarked</span>
                    <input
                      type="checkbox"
                      checked={form.bookmarked}
                      onChange={(e) => setForm((previous) => ({ ...previous, bookmarked: e.target.checked }))}
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm">Flagged</span>
                    <input
                      type="checkbox"
                      checked={form.flagged}
                      onChange={(e) => setForm((previous) => ({ ...previous, flagged: e.target.checked }))}
                    />
                  </label>

                  <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/10 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/65">Preview</span>
                      <div className="flex items-center gap-2">
                        {form.premium ? <Crown className="h-4 w-4 text-fuchsia-100" /> : null}
                        {form.locked ? <Lock className="h-4 w-4 text-red-100" /> : null}
                        {form.featured ? <Star className="h-4 w-4 text-amber-100" /> : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="submit"
                    disabled={saving}
                    leftIcon={saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  >
                    {saving ? 'Saving...' : editingId ? 'Update Question' : 'Create Question'}
                  </Button>

                  <Button type="button" variant="secondary" onClick={closeForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {selectedQuestion ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
            <div className="w-full max-w-4xl rounded-[32px] border border-white/10 bg-[#08111F] p-6 shadow-2xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="premium">{typeLabel(selectedQuestion.type)}</Badge>
                    <Badge variant={getStatusVariant(selectedQuestion.status)}>{selectedQuestion.status}</Badge>
                    <Badge
                      variant={
                        selectedQuestion.difficulty === 'easy'
                          ? 'success'
                          : selectedQuestion.difficulty === 'hard'
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {difficultyLabel(selectedQuestion.difficulty)}
                    </Badge>
                    {selectedQuestion.premium ? <Badge variant="premium">Premium</Badge> : null}
                    {selectedQuestion.featured ? <Badge variant="success">Featured</Badge> : null}
                    {selectedQuestion.locked ? <Badge variant="danger">Locked</Badge> : null}
                    {selectedQuestion.flagged ? <Badge variant="warning">Flagged</Badge> : null}
                  </div>

                  <h2 className="text-3xl font-black tracking-tight">{selectedQuestion.title || selectedQuestion.question.slice(0, 72)}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/60">{selectedQuestion.subjectName}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedQuestion(null)}
                  className="rounded-2xl border border-white/10 p-3 text-white/70 transition hover:bg-white/[0.05]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <DetailCard label="Subject" value={selectedQuestion.subjectName} icon={<BookOpen className="h-4 w-4" />} />
                <DetailCard label="Chapter" value={selectedQuestion.chapterName || '--'} icon={<Layers3 className="h-4 w-4" />} />
                <DetailCard label="Points" value={selectedQuestion.points} icon={<Star className="h-4 w-4" />} />
                <DetailCard label="Order" value={selectedQuestion.order} icon={<Wand2 className="h-4 w-4" />} />
              </div>

              <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-4 flex items-center gap-2 text-cyan-100">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-semibold">Question</span>
                </div>
                <p className="text-sm leading-8 text-white/75">{selectedQuestion.question}</p>
              </div>

              {selectedQuestion.options.length > 0 ? (
                <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="mb-4 flex items-center gap-2 text-cyan-100">
                    <Wand2 className="h-4 w-4" />
                    <span className="text-sm font-semibold">Options</span>
                  </div>
                  <div className="space-y-3">
                    {selectedQuestion.options.map((option) => (
                      <div
                        key={option.id}
                        className={[
                          'flex items-center justify-between gap-3 rounded-2xl border px-4 py-3',
                          option.isCorrect
                            ? 'border-emerald-400/15 bg-emerald-400/10'
                            : 'border-white/10 bg-white/[0.04]',
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

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="mb-3 flex items-center gap-2 text-cyan-100">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-semibold">Explanation</span>
                  </div>
                  <p className="text-sm leading-7 text-white/65">{selectedQuestion.explanation || '--'}</p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="mb-3 flex items-center gap-2 text-cyan-100">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-semibold">Hint</span>
                  </div>
                  <p className="text-sm leading-7 text-white/65">{selectedQuestion.hint || '--'}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => openEdit(selectedQuestion)} leftIcon={<Edit3 className="h-4 w-4" />}>
                  Edit Question
                </Button>
                <Button variant="secondary" onClick={() => togglePremium(selectedQuestion.id)} leftIcon={<Crown className="h-4 w-4" />}>
                  Toggle Premium
                </Button>
                <Button variant="secondary" onClick={() => toggleFeatured(selectedQuestion.id)} leftIcon={<Star className="h-4 w-4" />}>
                  Toggle Featured
                </Button>
                <Button variant="secondary" onClick={() => setStatus(selectedQuestion.id, 'published')} leftIcon={<CheckCircle2 className="h-4 w-4" />}>
                  Publish
                </Button>
                <Button variant="ghost" onClick={() => setSelectedQuestion(null)} leftIcon={<ArrowRight className="h-4 w-4" />}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-white/40">{label}</div>
      <div className="mt-1 text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function DetailCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-2 text-cyan-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">{label}</p>
          <h4 className="mt-1 text-lg font-bold text-white">{value}</h4>
        </div>
      </div>
    </div>
  );
}
