// bep-full-project/src/pages/admin/AdminContentPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  Filter,
  Flame,
  Layers3,
  Loader2,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type ContentType =
  | 'announcement'
  | 'banner'
  | 'testimonial'
  | 'blog'
  | 'faq'
  | 'page';

type ContentStatus =
  | 'draft'
  | 'published'
  | 'archived';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: ContentType;
  excerpt?: string;
  body: string;
  status: ContentStatus;
  premium?: boolean;
  featured?: boolean;
  pinned?: boolean;
  order: number;
  author?: string;
  publishDate?: string;
  updatedAt?: string;
}

interface ContentFormState {
  title: string;
  slug: string;
  type: ContentType;
  excerpt: string;
  body: string;
  status: ContentStatus;
  premium: boolean;
  featured: boolean;
  pinned: boolean;
  order: number;
  author: string;
  publishDate: string;
}

const typeLabels: Record<ContentType, string> = {
  announcement: 'Announcement',
  banner: 'Banner',
  testimonial: 'Testimonial',
  blog: 'Blog',
  faq: 'FAQ',
  page: 'Page',
};

const statusLabels: Record<ContentStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

const initialForm: ContentFormState = {
  title: '',
  slug: '',
  type: 'announcement',
  excerpt: '',
  body: '',
  status: 'draft',
  premium: false,
  featured: false,
  pinned: false,
  order: 1,
  author: '',
  publishDate: '',
};

const seedContent: ContentItem[] = [
  {
    id: 'content-1',
    title: 'New AI Study Assistant Launch',
    slug: 'new-ai-study-assistant-launch',
    type: 'announcement',
    excerpt: 'BEP AI study assistant এখন আরও smarter, faster, and Bengali-first.',
    body: 'AI study assistant আপডেট করা হয়েছে যাতে Bengali explanations, exam hints, and weak topic support আরও ভালোভাবে কাজ করে।',
    status: 'published',
    premium: true,
    featured: true,
    pinned: true,
    order: 1,
    author: 'BEP Team',
    publishDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'content-2',
    title: 'How to Use Practice Engine',
    slug: 'how-to-use-practice-engine',
    type: 'blog',
    excerpt: 'Practice engine দিয়ে MCQ, SQ, CQ practice করার best workflow.',
    body: 'এই guide এ practice filters, timer, bookmarking, এবং review mode ব্যবহার করে কীভাবে দ্রুত progress করবেন তা দেখানো হয়েছে।',
    status: 'published',
    premium: false,
    featured: false,
    pinned: false,
    order: 2,
    author: 'Editorial Desk',
    publishDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'content-3',
    title: 'Leaderboard Weekly Challenge',
    slug: 'leaderboard-weekly-challenge',
    type: 'banner',
    excerpt: 'Weekly leaderboard এ top rank করার জন্য special challenge live আছে।',
    body: 'এই week এ বেশি practice, বেশি streak, এবং better accuracy score নিয়ে leaderboard climb করুন।',
    status: 'draft',
    premium: true,
    featured: false,
    pinned: false,
    order: 3,
    author: 'Growth Team',
    publishDate: '',
    updatedAt: new Date().toISOString(),
  },
];

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u0980-\u09FF]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function newId() {
  return `content-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function StatCard({
  title,
  value,
  icon,
  accent = 'cyan',
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  accent?: 'cyan' | 'emerald' | 'amber' | 'fuchsia';
}) {
  const accentClass = {
    cyan: 'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
    emerald: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
    amber: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
    fuchsia: 'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
  }[accent];

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/55">{title}</p>
          <h3 className="mt-2 text-4xl font-black text-white">{value}</h3>
        </div>
        <div className={['flex h-14 w-14 items-center justify-center rounded-2xl border', accentClass].join(' ')}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block text-sm text-white/60">{children}</label>;
}

export default function AdminContentPage() {
  const [items, setItems] = useState<ContentItem[]>(seedContent);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ContentFormState>(initialForm);

  const stats = useMemo(() => {
    return {
      total: items.length,
      published: items.filter((item) => item.status === 'published').length,
      draft: items.filter((item) => item.status === 'draft').length,
      premium: items.filter((item) => item.premium).length,
      featured: items.filter((item) => item.featured).length,
      pinned: items.filter((item) => item.pinned).length,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items
      .filter((item) => {
        const matchesSearch =
          !query ||
          [
            item.title,
            item.slug,
            item.excerpt,
            item.body,
            item.author,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query);

        const matchesType =
          typeFilter === 'all' || item.type === typeFilter;

        const matchesStatus =
          statusFilter === 'all' || item.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => a.order - b.order);
  }, [items, search, statusFilter, typeFilter]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      type: item.type,
      excerpt: item.excerpt || '',
      body: item.body,
      status: item.status,
      premium: Boolean(item.premium),
      featured: Boolean(item.featured),
      pinned: Boolean(item.pinned),
      order: item.order,
      author: item.author || '',
      publishDate: item.publishDate || '',
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;

    try {
      setSaving(true);

      const slug = form.slug.trim() || normalizeSlug(form.title);
      const now = new Date().toISOString();

      if (editingId) {
        setItems((previous) =>
          previous.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  title: form.title.trim(),
                  slug,
                  type: form.type,
                  excerpt: form.excerpt.trim(),
                  body: form.body.trim(),
                  status: form.status,
                  premium: form.premium,
                  featured: form.featured,
                  pinned: form.pinned,
                  order: Number(form.order) || 1,
                  author: form.author.trim(),
                  publishDate: form.publishDate,
                  updatedAt: now,
                }
              : item,
          ),
        );
      } else {
        const nextItem: ContentItem = {
          id: newId(),
          title: form.title.trim(),
          slug,
          type: form.type,
          excerpt: form.excerpt.trim(),
          body: form.body.trim(),
          status: form.status,
          premium: form.premium,
          featured: form.featured,
          pinned: form.pinned,
          order: Number(form.order) || items.length + 1,
          author: form.author.trim(),
          publishDate: form.publishDate || (form.status === 'published' ? now : ''),
          updatedAt: now,
        };

        setItems((previous) => [nextItem, ...previous]);
      }

      closeForm();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Delete this content item?');
    if (!confirmed) return;

    setItems((previous) => previous.filter((item) => item.id !== id));
  };

  const handleToggleStatus = (id: string, nextStatus: ContentStatus) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
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

                <h1 className="text-4xl font-black tracking-tight">Content Management</h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  Announcement, banner, blog, FAQ, এবং page content এক জায়গা থেকে manage করুন।
                </p>
              </div>

              <Button onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>
                Add Content
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Items" value={stats.total} icon={<BookOpen className="h-5 w-5" />} accent="cyan" />
          <StatCard title="Published" value={stats.published} icon={<CheckCircle2 className="h-5 w-5" />} accent="emerald" />
          <StatCard title="Draft" value={stats.draft} icon={<Loader2 className="h-5 w-5" />} accent="amber" />
          <StatCard title="Premium" value={stats.premium} icon={<Star className="h-5 w-5" />} accent="fuchsia" />
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
                placeholder="Search content..."
                leftIcon={<Search className="h-4 w-4" />}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel>Type</FieldLabel>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as ContentType | 'all')}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All Types</option>
                    {(Object.keys(typeLabels) as ContentType[]).map((type) => (
                      <option key={type} value={type}>
                        {typeLabels[type]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel>Status</FieldLabel>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ContentStatus | 'all')}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All Status</option>
                    {(Object.keys(statusLabels) as ContentStatus[]).map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
                <p className="text-sm leading-7 text-white/70">
                  Content items can be pinned, featured, and premium-tagged for better homepage distribution.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-100">
                <Layers3 className="h-4 w-4" />
                <span className="text-sm font-semibold">Content List</span>
              </div>

              <Badge variant="secondary">{filteredItems.length} items</Badge>
            </div>

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-100" />
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="space-y-4">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="rounded-[24px] border border-white/10 bg-[#08111F]/75 p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <Badge variant="premium">{typeLabels[item.type]}</Badge>

                          <Badge
                            variant={
                              item.status === 'published'
                                ? 'success'
                                : item.status === 'draft'
                                  ? 'warning'
                                  : 'danger'
                            }
                          >
                            {statusLabels[item.status]}
                          </Badge>

                          {item.premium ? <Badge variant="premium">Premium</Badge> : null}
                          {item.featured ? <Badge variant="success">Featured</Badge> : null}
                          {item.pinned ? <Badge variant="secondary">Pinned</Badge> : null}
                        </div>

                        <h3 className="text-2xl font-bold text-white">{item.title}</h3>

                        <p className="mt-2 text-sm leading-7 text-white/60">
                          {item.excerpt || item.body.slice(0, 160)}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/55">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-cyan-100" />
                            {item.slug}
                          </div>

                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-emerald-100" />
                            {item.author || 'BEP Team'}
                          </div>

                          <div className="flex items-center gap-2">
                            <Layers3 className="h-4 w-4 text-fuchsia-100" />
                            Order #{item.order}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <ActionButton
                          icon={<CheckCircle2 className="h-4 w-4" />}
                          onClick={() => handleToggleStatus(item.id, 'published')}
                        />
                        <ActionButton
                          icon={<Loader2 className="h-4 w-4" />}
                          onClick={() => handleToggleStatus(item.id, 'draft')}
                        />
                        <ActionButton
                          icon={<Pencil className="h-4 w-4" />}
                          onClick={() => openEdit(item)}
                        />
                        <ActionButton
                          danger
                          icon={<Trash2 className="h-4 w-4" />}
                          onClick={() => handleDelete(item.id)}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10">
                <XCircle className="h-12 w-12 text-white/30" />
                <h3 className="mt-4 text-xl font-bold">No content found</h3>
                <p className="mt-2 text-sm text-white/55">Adjust filters or create a new content item.</p>
              </div>
            )}
          </div>
        </div>

        {showForm ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#08111F] p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black">
                    {editingId ? 'Edit Content' : 'Create Content'}
                  </h2>
                  <p className="mt-2 text-sm text-white/60">
                    Manage content visibility, type, and publishing options.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-2xl border border-white/10 p-3 text-white/70 transition hover:bg-white/[0.05]"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm((previous) => ({ ...previous, title: e.target.value, slug: previous.slug || normalizeSlug(e.target.value) }))
                    }
                    placeholder="Title"
                  />

                  <Input
                    value={form.slug}
                    onChange={(e) => setForm((previous) => ({ ...previous, slug: e.target.value }))}
                    placeholder="Slug"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <FieldLabel>Type</FieldLabel>
                    <select
                      value={form.type}
                      onChange={(e) => setForm((previous) => ({ ...previous, type: e.target.value as ContentType }))}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                    >
                      {(Object.keys(typeLabels) as ContentType[]).map((type) => (
                        <option key={type} value={type}>
                          {typeLabels[type]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <FieldLabel>Status</FieldLabel>
                    <select
                      value={form.status}
                      onChange={(e) => setForm((previous) => ({ ...previous, status: e.target.value as ContentStatus }))}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                    >
                      {(Object.keys(statusLabels) as ContentStatus[]).map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    type="number"
                    value={String(form.order)}
                    onChange={(e) => setForm((previous) => ({ ...previous, order: Number(e.target.value) || 1 }))}
                    placeholder="Order"
                  />
                </div>

                <Input
                  value={form.author}
                  onChange={(e) => setForm((previous) => ({ ...previous, author: e.target.value }))}
                  placeholder="Author / Team"
                />

                <div>
                  <FieldLabel>Excerpt</FieldLabel>
                  <textarea
                    value={form.excerpt}
                    onChange={(e) => setForm((previous) => ({ ...previous, excerpt: e.target.value }))}
                    rows={3}
                    placeholder="Short summary"
                    className="w-full rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div>
                  <FieldLabel>Body</FieldLabel>
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm((previous) => ({ ...previous, body: e.target.value }))}
                    rows={8}
                    placeholder="Content body"
                    className="w-full rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  />
                </div>

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
                    <span className="text-sm">Featured</span>
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((previous) => ({ ...previous, featured: e.target.checked }))}
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm">Pinned</span>
                    <input
                      type="checkbox"
                      checked={form.pinned}
                      onChange={(e) => setForm((previous) => ({ ...previous, pinned: e.target.checked }))}
                    />
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="submit"
                    disabled={saving}
                    leftIcon={
                      saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />
                    }
                  >
                    {saving ? 'Saving...' : editingId ? 'Update Content' : 'Create Content'}
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
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex h-11 w-11 items-center justify-center rounded-2xl border transition',
        danger
          ? 'border-red-400/15 bg-red-400/10 text-red-100 hover:bg-red-400/20'
          : 'border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white',
      ].join(' ')}
    >
      {icon}
    </button>
  );
}
