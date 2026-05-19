// bep-full-project/src/pages/admin/AdminChaptersPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Eye,
  Filter,
  FolderOpen,
  Layers3,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Shield,
  Sparkles,
  Trash2,
  X,
  Zap,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';

import { cn } from '@/lib/cn';
import { formatRelativeDate, formatNumber } from '@/lib/formatters';
import useDebounce from '@/hooks/useDebounce';

import { chaptersService } from '@/features/chapters/services/chapters.service';
import { subjectsService } from '@/features/subjects/services/subjects.service';

type ChapterStatus = 'draft' | 'active' | 'archived';

interface ChapterRow {
  id: string;
  name: string;
  slug?: string;
  subjectId?: string;
  subjectName?: string;
  description?: string;
  status?: ChapterStatus;
  order?: number;
  premium?: boolean;
  featured?: boolean;
  locked?: boolean;
  totalQuestions?: number;
  totalStudents?: number;
  averageScore?: number;
  lastUpdatedAt?: string;
  createdAt?: string;
}

interface SubjectOption {
  id: string;
  name: string;
}

interface ChapterFormValues {
  name: string;
  slug: string;
  subjectId: string;
  description: string;
  order: number;
  status: ChapterStatus;
  premium: boolean;
  featured: boolean;
  locked: boolean;
  totalQuestions: number;
  totalStudents: number;
  averageScore: number;
}

const EMPTY_FORM: ChapterFormValues = {
  name: '',
  slug: '',
  subjectId: '',
  description: '',
  order: 1,
  status: 'draft',
  premium: false,
  featured: false,
  locked: false,
  totalQuestions: 0,
  totalStudents: 0,
  averageScore: 0,
};

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toChapterRows(chapters: unknown[], subjectsById: Map<string, string>): ChapterRow[] {
  return safeArray<Record<string, unknown>>(chapters).map((item) => ({
    id: String(item.id || item.chapterId || item.slug || Math.random().toString(36).slice(2)),
    name: String(item.name || item.title || ''),
    slug: item.slug ? String(item.slug) : undefined,
    subjectId: item.subjectId ? String(item.subjectId) : undefined,
    subjectName: item.subjectId ? subjectsById.get(String(item.subjectId)) || undefined : undefined,
    description: item.description ? String(item.description) : undefined,
    status: (item.status as ChapterStatus) || 'draft',
    order: typeof item.order === 'number' ? item.order : Number(item.order || 0),
    premium: Boolean(item.premium),
    featured: Boolean(item.featured),
    locked: Boolean(item.locked),
    totalQuestions: typeof item.totalQuestions === 'number' ? item.totalQuestions : Number(item.totalQuestions || 0),
    totalStudents: typeof item.totalStudents === 'number' ? item.totalStudents : Number(item.totalStudents || 0),
    averageScore: typeof item.averageScore === 'number' ? item.averageScore : Number(item.averageScore || 0),
    lastUpdatedAt: typeof item.lastUpdatedAt === 'string' ? item.lastUpdatedAt : typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : undefined,
  }));
}

function getStatusBadge(status?: ChapterStatus) {
  switch (status) {
    case 'active':
      return <Badge variant="success">Active</Badge>;
    case 'archived':
      return <Badge variant="danger">Archived</Badge>;
    case 'draft':
    default:
      return <Badge variant="warning">Draft</Badge>;
  }
}

function StatCard({
  label,
  value,
  icon,
  tone = 'cyan',
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone?: 'cyan' | 'emerald' | 'amber' | 'fuchsia';
}) {
  const toneClass: Record<typeof tone, string> = {
    cyan: 'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
    emerald: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
    amber: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
    fuchsia: 'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl border', toneClass[tone])}>{icon}</div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-[#07111F] shadow-[0_20px_90px_rgba(0,0,0,0.45)]"
      >
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                <Sparkles className="h-3.5 w-3.5" />
                BEP Admin CMS
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">{title}</h3>
              {subtitle ? <p className="mt-2 text-sm leading-7 text-white/60">{subtitle}</p> : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6">{children}</div>
      </motion.div>
    </div>
  );
}

export default function AdminChaptersPage() {
  const chaptersApi = chaptersService as unknown as {
    listChapters?: (options?: { take?: number }) => Promise<unknown[]>;
    createChapter?: (payload: Record<string, unknown>) => Promise<string>;
    updateChapter?: (id: string, payload: Record<string, unknown>) => Promise<void>;
    deleteChapter?: (id: string) => Promise<void>;
    setChapterStatus?: (id: string, status: ChapterStatus) => Promise<void>;
    reorderChapters?: (ids: string[]) => Promise<void>;
  };

  const subjectsApi = subjectsService as unknown as {
    listSubjects?: (options?: { take?: number; status?: 'active' | 'draft' | 'archived' }) => Promise<unknown[]>;
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [chapters, setChapters] = useState<ChapterRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ChapterStatus>('all');
  const [subjectFilter, setSubjectFilter] = useState<'all' | string>('all');
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<ChapterRow | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<ChapterRow | null>(null);
  const [form, setForm] = useState<ChapterFormValues>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 250);

  const subjectsById = useMemo(() => new Map(subjects.map((subject) => [subject.id, subject.name])), [subjects]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [chapterData, subjectData] = await Promise.all([
        chaptersApi.listChapters ? chaptersApi.listChapters({ take: 500 }) : Promise.resolve([]),
        subjectsApi.listSubjects ? subjectsApi.listSubjects({ take: 500, status: 'active' }) : Promise.resolve([]),
      ]);

      const subjectRows: SubjectOption[] = safeArray<Record<string, unknown>>(subjectData).map((item) => ({
        id: String(item.id || item.subjectId || ''),
        name: String(item.name || item.title || 'Untitled subject'),
      }));

      setSubjects(subjectRows);
      setChapters(toChapterRows(safeArray<Record<string, unknown>>(chapterData), new Map(subjectRows.map((subject) => [subject.id, subject.name]))));
    } catch (error) {
      setChapters([]);
      setSubjects([]);
      console.error('Failed to load chapters', error);
    } finally {
      setLoading(false);
    }
  }, [chaptersApi, subjectsApi]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const stats = useMemo(() => {
    const total = chapters.length;
    const active = chapters.filter((chapter) => chapter.status === 'active').length;
    const drafts = chapters.filter((chapter) => chapter.status === 'draft').length;
    const archived = chapters.filter((chapter) => chapter.status === 'archived').length;
    const premium = chapters.filter((chapter) => chapter.premium).length;
    const locked = chapters.filter((chapter) => chapter.locked).length;

    return { total, active, drafts, archived, premium, locked };
  }, [chapters]);

  const filteredChapters = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return chapters.filter((chapter) => {
      const matchesSearch =
        !query ||
        [chapter.name, chapter.slug, chapter.description, chapter.subjectName, chapter.subjectId]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesStatus = statusFilter === 'all' ? true : chapter.status === statusFilter;
      const matchesSubject = subjectFilter === 'all' ? true : chapter.subjectId === subjectFilter;
      const matchesPremium = premiumOnly ? Boolean(chapter.premium) : true;

      return matchesSearch && matchesStatus && matchesSubject && matchesPremium;
    });
  }, [chapters, debouncedSearch, premiumOnly, statusFilter, subjectFilter]);

  const resetForm = useCallback((chapter?: ChapterRow | null) => {
    if (!chapter) {
      setForm(EMPTY_FORM);
      return;
    }

    setForm({
      name: chapter.name || '',
      slug: chapter.slug || '',
      subjectId: chapter.subjectId || '',
      description: chapter.description || '',
      order: chapter.order || 1,
      status: chapter.status || 'draft',
      premium: Boolean(chapter.premium),
      featured: Boolean(chapter.featured),
      locked: Boolean(chapter.locked),
      totalQuestions: chapter.totalQuestions || 0,
      totalStudents: chapter.totalStudents || 0,
      averageScore: chapter.averageScore || 0,
    });
  }, []);

  const openCreate = useCallback(() => {
    setSelectedChapter(null);
    resetForm(null);
    setFormError(null);
    setEditorOpen(true);
  }, [resetForm]);

  const openEdit = useCallback(
    (chapter: ChapterRow) => {
      setSelectedChapter(chapter);
      resetForm(chapter);
      setFormError(null);
      setEditorOpen(true);
    },
    [resetForm],
  );

  const handleCreateOrUpdate = useCallback(async () => {
    if (!form.name.trim()) {
      setFormError('Chapter name is required.');
      return;
    }

    if (!form.subjectId) {
      setFormError('Please select a subject.');
      return;
    }

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      subjectId: form.subjectId,
      description: form.description.trim() || '',
      order: Number(form.order || 1),
      status: form.status,
      premium: form.premium,
      featured: form.featured,
      locked: form.locked,
      totalQuestions: Number(form.totalQuestions || 0),
      totalStudents: Number(form.totalStudents || 0),
      averageScore: Number(form.averageScore || 0),
    };

    setSaving(true);
    setFormError(null);

    try {
      if (selectedChapter?.id && chaptersApi.updateChapter) {
        await chaptersApi.updateChapter(selectedChapter.id, payload);
      } else if (chaptersApi.createChapter) {
        await chaptersApi.createChapter(payload);
      } else {
        throw new Error('Chapter service is not available.');
      }

      await loadData();
      setEditorOpen(false);
      setSelectedChapter(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save chapter.');
    } finally {
      setSaving(false);
    }
  }, [chaptersApi, form, loadData, selectedChapter?.id]);

  const handleDelete = useCallback(async () => {
    if (!confirmDelete?.id) return;

    setDeleting(confirmDelete.id);
    try {
      if (chaptersApi.deleteChapter) {
        await chaptersApi.deleteChapter(confirmDelete.id);
      } else {
        throw new Error('Delete action is not available.');
      }

      await loadData();
      setConfirmDelete(null);
    } catch (error) {
      console.error('Failed to delete chapter', error);
