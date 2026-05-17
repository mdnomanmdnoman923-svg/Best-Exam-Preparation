// bep-full-project/src/pages/admin/AdminSubjectsPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookMarked,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock3,
  Crown,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Flame,
  Globe,
  GraduationCap,
  Grid2X2,
  Layers3,
  Loader2,
  Lock,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Users,
  Wand2,
  X,
  XCircle,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type SubjectStatus = 'draft' | 'published' | 'archived';
type SubjectDifficulty = 'beginner' | 'intermediate' | 'advanced';

interface SubjectItem {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  thumbnail?: string;
  description: string;
  shortDescription?: string;
  category: string;
  educationLevel: string;
  className: string;
  instructor?: string;
  language: string;
  status: SubjectStatus;
  difficulty: SubjectDifficulty;
  premium: boolean;
  featured: boolean;
  locked: boolean;
  trending: boolean;
  totalChapters: number;
  totalQuestions: number;
  totalStudents: number;
  estimatedHours: number;
  progressPercentage?: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface SubjectFormState {
  name: string;
  slug: string;
  icon: string;
  thumbnail: string;
  description: string;
  shortDescription: string;
  category: string;
  educationLevel: string;
  className: string;
  instructor: string;
  language: string;
  status: SubjectStatus;
  difficulty: SubjectDifficulty;
  premium: boolean;
  featured: boolean;
  locked: boolean;
  trending: boolean;
  totalChapters: number;
  totalQuestions: number;
  totalStudents: number;
  estimatedHours: number;
  progressPercentage: number;
  tags: string;
}

const categoryOptions = [
  'Science',
  'Commerce',
  'Arts',
  'Engineering',
  'Medical',
  'Admission',
  'Language',
  'Skills',
];

const languageOptions = ['Bangla', 'English', 'Mixed'];

const seedSubjects: SubjectItem[] = [
  {
    id: 'sub-1',
    name: 'Higher Math',
    slug: 'higher-math',
    description:
      'Advanced algebra, calculus, trigonometry, and problem-solving for HSC students.',
    shortDescription: 'HSC advanced mathematics preparation.',
    category: 'Science',
    educationLevel: 'HSC',
    className: 'Class 11-12',
    instructor: 'BEP Math Team',
    language: 'Bangla',
    status: 'published',
    difficulty: 'advanced',
    premium: true,
    featured: true,
    locked: false,
    trending: true,
    totalChapters: 18,
    totalQuestions: 3200,
    totalStudents: 12050,
    estimatedHours: 145,
    progressPercentage: 88,
    tags: ['math', 'hsc', 'calculus'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sub-2',
    name: 'Physics',
    slug: 'physics',
    description:
      'Mechanics, electricity, optics, modern physics, and full concept-based preparation.',
    shortDescription: 'Complete HSC physics mastery.',
    category: 'Science',
    educationLevel: 'HSC',
    className: 'Class 11-12',
    instructor: 'BEP Physics Team',
    language: 'Mixed',
    status: 'published',
    difficulty: 'intermediate',
    premium: false,
    featured: true,
    locked: false,
    trending: true,
    totalChapters: 14,
    totalQuestions: 2500,
    totalStudents: 14500,
    estimatedHours: 122,
    progressPercentage: 94,
    tags: ['physics', 'mechanics', 'hsc'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sub-3',
    name: 'English Grammar',
    slug: 'english-grammar',
    description:
      'Grammar rules, vocabulary, writing, comprehension, and admission preparation.',
    shortDescription: 'Grammar and writing mastery.',
    category: 'Language',
    educationLevel: 'Admission',
    className: 'All Levels',
    instructor: 'BEP Language Team',
    language: 'English',
    status: 'draft',
    difficulty: 'beginner',
    premium: false,
    featured: false,
    locked: true,
    trending: false,
    totalChapters: 10,
    totalQuestions: 980,
    totalStudents: 3100,
    estimatedHours: 48,
    progressPercentage: 52,
    tags: ['english', 'grammar'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialForm: SubjectFormState = {
  name: '',
  slug: '',
  icon: '',
  thumbnail: '',
  description: '',
  shortDescription: '',
  category: 'Science',
  educationLevel: '',
  className: '',
  instructor: '',
  language: 'Bangla',
  status: 'draft',
  difficulty: 'beginner',
  premium: false,
  featured: false,
  locked: false,
  trending: false,
  totalChapters: 0,
  totalQuestions: 0,
  totalStudents: 0,
  estimatedHours: 0,
  progressPercentage: 0,
  tags: '',
};

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function createSubjectId() {
  return `subject-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function difficultyLabel(level: SubjectDifficulty) {
  switch (level) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    default:
      return 'Beginner';
  }
}

function statusVariant(status: SubjectStatus) {
  switch (status) {
    case 'published':
      return 'success' as const;
    case 'draft':
      return 'warning' as const;
    case 'archived':
      return 'danger' as const;
    default:
      return 'secondary' as const;
  }
}

function difficultyVariant(level: SubjectDifficulty) {
  switch (level) {
    case 'beginner':
      return 'success' as const;
    case 'intermediate':
      return 'warning' as const;
    case 'advanced':
      return 'danger' as const;
    default:
      return 'secondary' as const;
  }
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

function ToggleCard({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        'rounded-[24px] border p-4 text-left transition',
        checked
          ? 'border-cyan-400/20 bg-cyan-400/10'
          : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.06]',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-white">{label}</h4>
          <p className="mt-1 text-sm leading-6 text-white/55">{description}</p>
        </div>

        {checked ? (
          <CheckCircle2 className="h-5 w-5 text-cyan-100" />
        ) : (
          <XCircle className="h-5 w-5 text-white/30" />
        )}
      </div>
    </button>
  );
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>(seedSubjects);
  const [loading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubjectStatus | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<SubjectDifficulty | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [premiumFilter, setPremiumFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'yes' | 'no'>('all');

  const [showForm, setShowForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<SubjectFormState>(initialForm);

  const stats = useMemo(() => {
    return {
      total: subjects.length,
      published: subjects.filter((item) => item.status === 'published').length,
      premium: subjects.filter((item) => item.premium).length,
      featured: subjects.filter((item) => item.featured).length,
      totalStudents: subjects.reduce((sum, item) => sum + item.totalStudents, 0),
      totalQuestions: subjects.reduce((sum, item) => sum + item.totalQuestions, 0),
    };
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return subjects.filter((subject) => {
      const matchesSearch =
        !query ||
        [
          subject.name,
          subject.description,
          subject.shortDescription,
          subject.category,
          subject.educationLevel,
          subject.className,
          subject.instructor,
          subject.tags.join(' '),
        ]
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === 'all' || subject.status === statusFilter;

      const matchesDifficulty =
        difficultyFilter === 'all' ||
        subject.difficulty === difficultyFilter;

      const matchesCategory =
        categoryFilter === 'all' ||
        subject.category === categoryFilter;

      const matchesPremium =
        premiumFilter === 'all' ||
        (premiumFilter === 'yes'
          ? subject.premium
          : !subject.premium);

      const matchesFeatured =
        featuredFilter === 'all' ||
        (featuredFilter === 'yes'
          ? subject.featured
          : !subject.featured);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDifficulty &&
        matchesCategory &&
        matchesPremium &&
        matchesFeatured
      );
    });
  }, [
    categoryFilter,
    difficultyFilter,
    featuredFilter,
    premiumFilter,
    search,
    statusFilter,
    subjects,
  ]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (subject: SubjectItem) => {
    setEditingId(subject.id);

    setForm({
      name: subject.name,
      slug: subject.slug,
      icon: subject.icon || '',
      thumbnail: subject.thumbnail || '',
      description: subject.description,
      shortDescription: subject.shortDescription || '',
      category: subject.category,
      educationLevel: subject.educationLevel,
      className: subject.className,
      instructor: subject.instructor || '',
      language: subject.language,
      status: subject.status,
      difficulty: subject.difficulty,
      premium: subject.premium,
      featured: subject.featured,
      locked: subject.locked,
      trending: subject.trending,
      totalChapters: subject.totalChapters,
      totalQuestions: subject.totalQuestions,
      totalStudents: subject.totalStudents,
      estimatedHours: subject.estimatedHours,
      progressPercentage: subject.progressPercentage || 0,
      tags: subject.tags.join(', '),
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      return;
    }

    try {
      setSaving(true);

      const now = new Date().toISOString();

      const nextSubject: SubjectItem = {
        id: editingId || createSubjectId(),
        name: form.name.trim(),
        slug: form.slug.trim()
          ? normalizeSlug(form.slug)
          : normalizeSlug(form.name),
        icon: form.icon.trim(),
        thumbnail: form.thumbnail.trim(),
        description: form.description.trim(),
        shortDescription: form.shortDescription.trim(),
        category: form.category,
        educationLevel: form.educationLevel.trim(),
        className: form.className.trim(),
        instructor: form.instructor.trim(),
        language: form.language,
        status: form.status,
        difficulty: form.difficulty,
        premium: form.premium,
        featured: form.featured,
        locked: form.locked,
        trending: form.trending,
        totalChapters: Number(form.totalChapters) || 0,
        totalQuestions: Number(form.totalQuestions) || 0,
        totalStudents: Number(form.totalStudents) || 0,
        estimatedHours: Number(form.estimatedHours) || 0,
        progressPercentage:
          Number(form.progressPercentage) || 0,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        createdAt: editingId
          ? subjects.find((item) => item.id === editingId)?.createdAt
          : now,
        updatedAt: now,
      };

      setSubjects((previous) =>
        editingId
          ? previous.map((item) =>
              item.id === editingId ? nextSubject : item,
            )
          : [nextSubject, ...previous],
      );

      closeForm();
    } finally {
      setSaving(false);
    }
  };

  const removeSubject = (id: string) => {
    const confirmed = window.confirm(
      'Delete this subject?',
    );

    if (!confirmed) return;

    setSubjects((previous) =>
      previous.filter((item) => item.id !== id),
    );

    if (selectedSubject?.id === id) {
      setSelectedSubject(null);
    }
  };

  const toggleField = (
    id: string,
    field:
      | 'premium'
      | 'featured'
      | 'locked'
      | 'trending',
  ) => {
    setSubjects((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: !item[field],
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  };

  const changeStatus = (
    id: string,
    status: SubjectStatus,
  ) => {
    setSubjects((previous) =>
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

  const duplicateSubject = (subject: SubjectItem) => {
    const now = new Date().toISOString();

    const copy: SubjectItem = {
      ...subject,
      id: createSubjectId(),
      name: `${subject.name} Copy`,
      slug: `${subject.slug}-copy`,
      featured: false,
      trending: false,
      createdAt: now,
      updatedAt: now,
    };

    setSubjects((previous) => [copy, ...previous]);
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
                  Subject Management
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  Subjects create, organize, publish, and monitor করুন।
                  Chapters, question bank, premium access, and
                  engagement tracking সব এক জায়গা থেকে manage করুন।
                </p>
              </div>

              <Button
                onClick={openCreate}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Subject
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Subjects"
            value={stats.total}
            icon={<BookOpen className="h-5 w-5" />}
            accent="cyan"
            note="All subject entries"
          />

          <StatCard
            title="Published"
            value={stats.published}
            icon={<BadgeCheck className="h-5 w-5" />}
            accent="emerald"
            note="Visible to learners"
          />

          <StatCard
            title="Premium"
            value={stats.premium}
            icon={<Crown className="h-5 w-5" />}
            accent="fuchsia"
            note="Locked premium courses"
          />

          <StatCard
            title="Students"
            value={stats.totalStudents.toLocaleString()}
            icon={<Users className="h-5 w-5" />}
            accent="amber"
            note="Total enrolled learners"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-2 text-cyan-100">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Filters
              </span>
            </div>

            <div className="space-y-4">
              <Input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search subjects..."
                leftIcon={<Search className="h-4 w-4" />}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel>Status</FieldLabel>

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as
                          | SubjectStatus
                          | 'all',
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">
                      All Status
                    </option>
                    <option value="draft">
                      Draft
                    </option>
                    <option value="published">
                      Published
                    </option>
                    <option value="archived">
                      Archived
                    </option>
                  </select>
                </div>

                <div>
                  <FieldLabel>
                    Difficulty
                  </FieldLabel>

                  <select
                    value={difficultyFilter}
                    onChange={(e) =>
                      setDifficultyFilter(
                        e.target.value as
                          | SubjectDifficulty
                          | 'all',
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">
                      All Difficulty
                    </option>
                    <option value="beginner">
                      Beginner
                    </option>
                    <option value="intermediate">
                      Intermediate
                    </option>
                    <option value="advanced">
                      Advanced
                    </option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Category</FieldLabel>

                  <select
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(
                        e.target.value,
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">
                      All Categories
                    </option>

                    {categoryOptions.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div>
                  <FieldLabel>Premium</FieldLabel>

                  <select
                    value={premiumFilter}
                    onChange={(e) =>
                      setPremiumFilter(
                        e.target.value as
                          | 'all'
                          | 'yes'
                          | 'no',
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">
                      All
                    </option>
                    <option value="yes">
                      Premium Only
                    </option>
                    <option value="no">
                      Free Only
                    </option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Featured</FieldLabel>

                  <select
                    value={featuredFilter}
                    onChange={(e) =>
                      setFeaturedFilter(
                        e.target.value as
                          | 'all'
                          | 'yes'
                          | 'no',
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">
                      All
                    </option>
                    <option value="yes">
                      Featured
                    </option>
                    <option value="no">
                      Not Featured
                    </option>
                  </select>
                </div>
              </div>

              <div className="rounded-[26px] border border-cyan-400/15 bg-cyan-400/10 p-4">
                <p className="text-sm leading-7 text-white/75">
                  Filters ব্যবহার করে quickly subject library organize
                  করুন এবং premium / published content আলাদা করে
                  manage করুন।
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-cyan-100">
                <Grid2X2 className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Subjects
                </span>
              </div>

              <Badge variant="secondary">
                {filteredSubjects.length} items
              </Badge>
            </div>

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-100" />
              </div>
            ) : filteredSubjects.length > 0 ? (
              <div className="space-y-4">
                {filteredSubjects.map(
                  (subject, index) => (
                    <motion.div
                      key={subject.id}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.03,
                      }}
                      className="rounded-[26px] border border-white/10 bg-[#08111F]/75 p-5"
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <Badge
                              variant={statusVariant(
                                subject.status,
                              )}
                            >
                              {subject.status}
                            </Badge>

                            <Badge
                              variant={difficultyVariant(
                                subject.difficulty,
                              )}
                            >
                              {difficultyLabel(
                                subject.difficulty,
                              )}
                            </Badge>

                            {subject.premium ? (
                              <Badge variant="premium">
                                Premium
                              </Badge>
                            ) : null}

                            {subject.featured ? (
                              <Badge variant="success">
                                Featured
                              </Badge>
                            ) : null}

                            {subject.trending ? (
                              <Badge variant="warning">
                                Trending
                              </Badge>
                            ) : null}

                            {subject.locked ? (
                              <Badge variant="danger">
                                Locked
                              </Badge>
                            ) : null}
                          </div>

                          <h3 className="text-2xl font-bold text-white">
                            {subject.name}
                          </h3>

                          <p className="mt-2 text-sm leading-7 text-white/60">
                            {subject.description}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/55">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-cyan-100" />
                              {subject.educationLevel}
                            </div>

                            <div className="flex items-center gap-2">
                              <Layers3 className="h-4 w-4 text-emerald-100" />
                              {subject.totalChapters} chapters
                            </div>

                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-fuchsia-100" />
                              {subject.totalQuestions.toLocaleString()}{' '}
                              questions
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock3 className="h-4 w-4 text-amber-100" />
                              {subject.estimatedHours}h
                            </div>
                          </div>

                          {subject.tags.length > 0 ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {subject.tags.map(
                                (tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55"
                                  >
                                    #{tag}
                                  </span>
                                ),
                              )}
                            </div>
                          ) : null}

                          <div className="mt-5">
                            <div className="mb-2 flex items-center justify-between text-xs text-white/45">
                              <span>
                                Completion
                              </span>
                              <span>
                                {subject.progressPercentage || 0}
                                %
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-400"
                                style={{
                                  width: `${subject.progressPercentage || 0}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 xl:min-w-[220px]">
                          <Button
                            variant="secondary"
                            onClick={() =>
                              setSelectedSubject(
                                subject,
                              )
                            }
                            leftIcon={
                              <Eye className="h-4 w-4" />
                            }
                          >
                            View
                          </Button>

                          <Button
                            variant="secondary"
                            onClick={() =>
                              openEdit(subject)
                            }
                            leftIcon={
                              <Edit3 className="h-4 w-4" />
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            onClick={() =>
                              duplicateSubject(
                                subject,
                              )
                            }
                            leftIcon={
                              <BookMarked className="h-4 w-4" />
                            }
                          >
                            Duplicate
                          </Button>

                          <Button
                            variant="secondary"
                            onClick={() =>
                              changeStatus(
                                subject.id,
                                subject.status ===
                                  'published'
                                  ? 'draft'
                                  : 'published',
                              )
                            }
                            leftIcon={
                              <BadgeCheck className="h-4 w-4" />
                            }
                          >
                            {subject.status ===
                            'published'
                              ? 'Unpublish'
                              : 'Publish'}
                          </Button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleField(
                                subject.id,
                                'premium',
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
                          >
                            <Crown className="h-4 w-4" />
                            {subject.premium
                              ? 'Remove Premium'
                              : 'Make Premium'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleField(
                                subject.id,
                                'featured',
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
                          >
                            <Star className="h-4 w-4" />
                            {subject.featured
                              ? 'Unfeature'
                              : 'Feature'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleField(
                                subject.id,
                                'trending',
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
                          >
                            <TrendingUp className="h-4 w-4" />
                            {subject.trending
                              ? 'Remove Trend'
                              : 'Make Trending'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleField(
                                subject.id,
                                'locked',
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
                          >
                            <Lock className="h-4 w-4" />
                            {subject.locked
                              ? 'Unlock'
                              : 'Lock'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeSubject(
                                subject.id,
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/15 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-100 transition hover:bg-red-400/20"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ),
                )}
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10">
                <XCircle className="h-12 w-12 text-white/30" />

                <h3 className="mt-4 text-xl font-bold">
                  No subjects found
                </h3>

                <p className="mt-2 text-sm text-white/55">
                  Adjust filters or create a new subject.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Questions"
            value={stats.totalQuestions.toLocaleString()}
            icon={<Brain className="h-5 w-5" />}
            accent="cyan"
            note="Total question bank size"
          />

          <StatCard
            title="Featured"
            value={stats.featured}
            icon={<Flame className="h-5 w-5" />}
            accent="emerald"
            note="Highlighted learning content"
          />

          <StatCard
            title="Engagement"
            value="94%"
            icon={<TrendingUp className="h-5 w-5" />}
            accent="amber"
            note="Average subject activity"
          />

          <StatCard
            title="Global Reach"
            value="24K+"
            icon={<Globe className="h-5 w-5" />}
            accent="fuchsia"
            note="Active learners monthly"
          />
        </div>

        {showForm ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
            <div className="w-full max-w-6xl rounded-[32px] border border-white/10 bg-[#08111F] p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black">
                    {editingId
                      ? 'Edit Subject'
                      : 'Create Subject'}
                  </h2>

                  <p className="mt-2 text-sm text-white/60">
                    Subject details, visibility, progress, and
                    premium settings configure করুন।
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

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        name: e.target.value,
                        slug: normalizeSlug(
                          e.target.value,
                        ),
                      }))
                    }
                    placeholder="Subject name"
                  />

                  <Input
                    value={form.slug}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        slug: normalizeSlug(
                          e.target.value,
                        ),
                      }))
                    }
                    placeholder="Slug"
                  />

                  <Input
                    value={form.icon}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        icon: e.target.value,
                      }))
                    }
                    placeholder="Icon URL"
                  />

                  <Input
                    value={form.thumbnail}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        thumbnail:
                          e.target.value,
                      }))
                    }
                    placeholder="Thumbnail URL"
                  />
                </div>

                <div>
                  <FieldLabel>
                    Description
                  </FieldLabel>

                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        description:
                          e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Write subject description..."
                    className="w-full rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  />
                </div>

                <Input
                  value={form.shortDescription}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      shortDescription:
                        e.target.value,
                    }))
                  }
                  placeholder="Short description"
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <FieldLabel>
                      Category
                    </FieldLabel>

                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm((previous) => ({
                          ...previous,
                          category:
                            e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                    >
                      {categoryOptions.map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <FieldLabel>
                      Difficulty
                    </FieldLabel>

                    <select
                      value={form.difficulty}
                      onChange={(e) =>
                        setForm((previous) => ({
                          ...previous,
                          difficulty:
                            e.target
                              .value as SubjectDifficulty,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                    >
                      <option value="beginner">
                        Beginner
                      </option>
                      <option value="intermediate">
                        Intermediate
                      </option>
                      <option value="advanced">
                        Advanced
                      </option>
                    </select>
                  </div>

                  <div>
                    <FieldLabel>Status</FieldLabel>

                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm((previous) => ({
                          ...previous,
                          status:
                            e.target
                              .value as SubjectStatus,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                    >
                      <option value="draft">
                        Draft
                      </option>
                      <option value="published">
                        Published
                      </option>
                      <option value="archived">
                        Archived
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Input
                    value={form.educationLevel}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        educationLevel:
                          e.target.value,
                      }))
                    }
                    placeholder="Education level"
                  />

                  <Input
                    value={form.className}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        className:
                          e.target.value,
                      }))
                    }
                    placeholder="Class"
                  />

                  <Input
                    value={form.instructor}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        instructor:
                          e.target.value,
                      }))
                    }
                    placeholder="Instructor"
                  />
                </div>

                <div>
                  <FieldLabel>Language</FieldLabel>

                  <div className="grid gap-3 md:grid-cols-3">
                    {languageOptions.map(
                      (language) => (
                        <button
                          key={language}
                          type="button"
                          onClick={() =>
                            setForm(
                              (previous) => ({
                                ...previous,
                                language,
                              }),
                            )
                          }
                          className={[
                            'rounded-2xl border px-4 py-3 text-sm font-medium transition',
                            form.language ===
                            language
                              ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                              : 'border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/[0.06] hover:text-white',
                          ].join(' ')}
                        >
                          {language}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-5">
                  <Input
                    type="number"
                    value={String(
                      form.totalChapters,
                    )}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        totalChapters:
                          Number(
                            e.target.value,
                          ) || 0,
                      }))
                    }
                    placeholder="Chapters"
                  />

                  <Input
                    type="number"
                    value={String(
                      form.totalQuestions,
                    )}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        totalQuestions:
                          Number(
                            e.target.value,
                          ) || 0,
                      }))
                    }
                    placeholder="Questions"
                  />

                  <Input
                    type="number"
                    value={String(
                      form.totalStudents,
                    )}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        totalStudents:
                          Number(
                            e.target.value,
                          ) || 0,
                      }))
                    }
                    placeholder="Students"
                  />

                  <Input
                    type="number"
                    value={String(
                      form.estimatedHours,
                    )}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        estimatedHours:
                          Number(
                            e.target.value,
                          ) || 0,
                      }))
                    }
                    placeholder="Hours"
                  />

                  <Input
                    type="number"
                    value={String(
                      form.progressPercentage,
                    )}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        progressPercentage:
                          Number(
                            e.target.value,
                          ) || 0,
                      }))
                    }
                    placeholder="Progress %"
                  />
                </div>

                <Input
                  value={form.tags}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      tags: e.target.value,
                    }))
                  }
                  placeholder="Tags (comma separated)"
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <ToggleCard
                    label="Premium"
                    description="Restrict access for premium users."
                    checked={form.premium}
                    onChange={(value) =>
                      setForm((previous) => ({
                        ...previous,
                        premium: value,
                      }))
                    }
                  />

                  <ToggleCard
                    label="Featured"
                    description="Highlight on homepage."
                    checked={form.featured}
                    onChange={(value) =>
                      setForm((previous) => ({
                        ...previous,
                        featured: value,
                      }))
                    }
                  />

                  <ToggleCard
                    label="Trending"
                    description="Boost visibility in discovery."
                    checked={form.trending}
                    onChange={(value) =>
                      setForm((previous) => ({
                        ...previous,
                        trending: value,
                      }))
                    }
                  />

                  <ToggleCard
                    label="Locked"
                    description="Prevent public access."
                    checked={form.locked}
                    onChange={(value) =>
                      setForm((previous) => ({
                        ...previous,
                        locked: value,
                      }))
                    }
                  />
                </div>

                <div className="rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-cyan-100" />

                    <p className="text-sm leading-7 text-white/75">
                      Subject publish করার আগে chapters,
                      questions, and learning content carefully
                      review করুন।
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="submit"
                    disabled={saving}
                    leftIcon={
                      saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )
                    }
                  >
                    {saving
                      ? 'Saving...'
                      : editingId
                        ? 'Update Subject'
                        : 'Create Subject'}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={closeForm}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {selectedSubject ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
            <div className="w-full max-w-5xl rounded-[32px] border border-white/10 bg-[#08111F] p-6 shadow-2xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge
                      variant={statusVariant(
                        selectedSubject.status,
                      )}
                    >
                      {selectedSubject.status}
                    </Badge>

                    <Badge
                      variant={difficultyVariant(
                        selectedSubject.difficulty,
                      )}
                    >
                      {difficultyLabel(
                        selectedSubject.difficulty,
                      )}
                    </Badge>

                    {selectedSubject.premium ? (
                      <Badge variant="premium">
                        Premium
                      </Badge>
                    ) : null}

                    {selectedSubject.featured ? (
                      <Badge variant="success">
                        Featured
                      </Badge>
                    ) : null}

                    {selectedSubject.trending ? (
                      <Badge variant="warning">
                        Trending
                      </Badge>
                    ) : null}

                    {selectedSubject.locked ? (
                      <Badge variant="danger">
                        Locked
                      </Badge>
                    ) : null}
                  </div>

                  <h2 className="text-3xl font-black tracking-tight">
                    {selectedSubject.name}
                  </h2>

                  <p className="mt-2 text-sm text-white/60">
                    {selectedSubject.shortDescription}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedSubject(null)
                  }
                  className="rounded-2xl border border-white/10 p-3 text-white/70 transition hover:bg-white/[0.05]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoCard
                  label="Students"
                  value={selectedSubject.totalStudents.toLocaleString()}
                  icon={<Users className="h-4 w-4" />}
                />

                <InfoCard
                  label="Questions"
                  value={selectedSubject.totalQuestions.toLocaleString()}
                  icon={<Brain className="h-4 w-4" />}
                />

                <InfoCard
                  label="Chapters"
                  value={selectedSubject.totalChapters}
                  icon={<Layers3 className="h-4 w-4" />}
                />

                <InfoCard
                  label="Hours"
                  value={`${selectedSubject.estimatedHours}h`}
                  icon={<Clock3 className="h-4 w-4" />}
                />
              </div>

              <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-4 flex items-center gap-2 text-cyan-100">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-semibold">
                    Description
                  </span>
                </div>

                <p className="text-sm leading-8 text-white/75">
                  {selectedSubject.description}
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="mb-4 flex items-center gap-2 text-cyan-100">
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                      Academic Details
                    </span>
                  </div>

                  <div className="space-y-3">
                    <DetailRow
                      label="Category"
                      value={
                        selectedSubject.category
                      }
                    />

                    <DetailRow
                      label="Level"
                      value={
                        selectedSubject.educationLevel
                      }
                    />

                    <DetailRow
                      label="Class"
                      value={
                        selectedSubject.className
                      }
                    />

                    <DetailRow
                      label="Language"
                      value={
                        selectedSubject.language
                      }
                    />
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="mb-4 flex items-center gap-2 text-cyan-100">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                      Instructor & Reach
                    </span>
                  </div>

                  <div className="space-y-3">
                    <DetailRow
                      label="Instructor"
                      value={
                        selectedSubject.instructor ||
                        '--'
                      }
                    />

                    <DetailRow
                      label="Progress"
                      value={`${selectedSubject.progressPercentage || 0}%`}
                    />

                    <DetailRow
                      label="Slug"
                      value={
                        selectedSubject.slug
                      }
                    />
                  </div>
                </div>
              </div>

              {selectedSubject.tags.length > 0 ? (
                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-2 text-cyan-100">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                      Tags
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedSubject.tags.map(
                      (tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60"
                        >
                          #{tag}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    openEdit(selectedSubject)
                  }
                  leftIcon={
                    <Edit3 className="h-4 w-4" />
                  }
                >
                  Edit Subject
                </Button>

                <Button
                  variant="secondary"
                  onClick={() =>
                    toggleField(
                      selectedSubject.id,
                      'featured',
                    )
                  }
                  leftIcon={
                    <Star className="h-4 w-4" />
                  }
                >
                  Toggle Featured
                </Button>

                <Button
                  variant="secondary"
                  onClick={() =>
                    toggleField(
                      selectedSubject.id,
                      'premium',
                    )
                  }
                  leftIcon={
                    <Crown className="h-4 w-4" />
                  }
                >
                  Toggle Premium
                </Button>

                <Button
                  variant="secondary"
                  onClick={() =>
                    changeStatus(
                      selectedSubject.id,
                      'published',
                    )
                  }
                  leftIcon={
                    <Eye className="h-4 w-4" />
                  }
                >
                  Publish
                </Button>

                <Button
                  variant="ghost"
                  onClick={() =>
                    setSelectedSubject(null)
                  }
                  leftIcon={
                    <ArrowRight className="h-4 w-4" />
                  }
                >
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

function InfoCard({
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
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-cyan-100">
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
            {label}
          </p>

          <h4 className="mt-1 text-lg font-bold text-white">
            {value}
          </h4>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#08111F]/75 px-4 py-3">
      <span className="text-sm text-white/55">
        {label}
      </span>

      <span className="text-sm font-semibold text-white">
        {value}
      </span>
    </div>
  );
}
