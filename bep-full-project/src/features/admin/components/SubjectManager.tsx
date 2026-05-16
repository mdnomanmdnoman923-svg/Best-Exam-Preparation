// bep-full-project/src/features/admin/components/SubjectManager.tsx

import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Edit3,
  Filter,
  Layers3,
  Plus,
  Search,
  Trash2,
  TrendingUp,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface SubjectItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  totalQuestions: number;
  totalChapters: number;
  status: 'active' | 'inactive';
}

const initialSubjects: SubjectItem[] = [
  {
    id: 's-001',
    name: 'Physics',
    slug: 'physics',
    icon: 'Atom',
    color: '#06B6D4',
    totalQuestions: 3250,
    totalChapters: 12,
    status: 'active',
  },
  {
    id: 's-002',
    name: 'Chemistry',
    slug: 'chemistry',
    icon: 'FlaskConical',
    color: '#A855F7',
    totalQuestions: 2980,
    totalChapters: 10,
    status: 'active',
  },
  {
    id: 's-003',
    name: 'Mathematics',
    slug: 'mathematics',
    icon: 'Sigma',
    color: '#F59E0B',
    totalQuestions: 4100,
    totalChapters: 15,
    status: 'active',
  },
  {
    id: 's-004',
    name: 'English',
    slug: 'english',
    icon: 'MessageSquare',
    color: '#22C55E',
    totalQuestions: 1800,
    totalChapters: 8,
    status: 'inactive',
  },
];

export default function SubjectManager() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [subjects] = useState(initialSubjects);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesSearch = `${subject.name} ${subject.slug}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || subject.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, subjects]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/15 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-100">
            <Layers3 className="h-3.5 w-3.5" />
            Subject Control Panel
          </div>

          <h2 className="text-2xl font-bold text-white">
            Subject Manager
          </h2>

          <p className="mt-2 text-sm text-white/60">
            Category, icon, color এবং question distribution নিয়ন্ত্রণ করুন
          </p>
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />}>
          নতুন Subject
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <Input
          placeholder="Subject search করুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />

        <div className="relative">
          <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')
            }
            className="h-12 w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.04] px-11 text-sm text-white outline-none transition focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/15"
          >
            <option value="all" className="bg-[#0B1220]">
              সব Status
            </option>
            <option value="active" className="bg-[#0B1220]">
              Active
            </option>
            <option value="inactive" className="bg-[#0B1220]">
              Inactive
            </option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filteredSubjects.map((subject) => (
          <div
            key={subject.id}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.06]"
          >
            <div
              className="absolute right-0 top-0 h-20 w-20 rounded-bl-[3rem] opacity-20 blur-2xl"
              style={{ backgroundColor: subject.color }}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10"
                  style={{
                    backgroundColor: `${subject.color}20`,
                    color: subject.color,
                  }}
                >
                  <BookOpen className="h-6 w-6" />
                </div>

                <Badge
                  variant={subject.status === 'active' ? 'success' : 'secondary'}
                >
                  {subject.status}
                </Badge>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold text-white">
                  {subject.name}
                </h3>

                <p className="mt-1 text-xs text-white/45">
                  /{subject.slug}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/10 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/35">
                    Chapters
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {subject.totalChapters}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/35">
                    Questions
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {subject.totalQuestions}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-300" />
                <span className="text-xs text-white/55">
                  Content growth steady
                </span>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-100 transition hover:bg-cyan-400/15"
                  aria-label="Edit subject"
                >
                  <Edit3 className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/10 text-red-100 transition hover:bg-red-400/15"
                  aria-label="Delete subject"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
