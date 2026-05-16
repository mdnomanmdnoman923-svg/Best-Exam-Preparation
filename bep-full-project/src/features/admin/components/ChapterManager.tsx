// bep-full-project/src/features/admin/components/ChapterManager.tsx

import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Edit3,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Chapter {
  id: string;
  name: string;
  subject: string;
  totalQuestions: number;
  order: number;
}

const initialChapters: Chapter[] = [
  {
    id: '1',
    name: 'ভৌত রাশি',
    subject: 'Physics',
    totalQuestions: 320,
    order: 1,
  },
  {
    id: '2',
    name: 'গতিবিদ্যা',
    subject: 'Physics',
    totalQuestions: 540,
    order: 2,
  },
  {
    id: '3',
    name: 'রাসায়নিক বন্ধন',
    subject: 'Chemistry',
    totalQuestions: 280,
    order: 3,
  },
];

export default function ChapterManager() {
  const [search, setSearch] = useState('');
  const [chapters] = useState(initialChapters);

  const filteredChapters = useMemo(() => {
    return chapters.filter((chapter) =>
      `${chapter.name} ${chapter.subject}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [chapters, search]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Chapter Manager
          </h2>

          <p className="mt-2 text-sm text-white/60">
            Subject অনুযায়ী chapter manage করুন
          </p>
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />}>
          নতুন Chapter
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Chapter search করুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white/[0.03]">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-white/45">
                  Chapter
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-white/45">
                  Subject
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-white/45">
                  Questions
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-white/45">
                  Order
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-widest text-white/45">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredChapters.map((chapter) => (
                <tr
                  key={chapter.id}
                  className="border-t border-white/5 transition hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                        <BookOpen className="h-5 w-5" />
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {chapter.name}
                        </h4>

                        <p className="text-xs text-white/45">
                          Chapter ID: {chapter.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-white/75">
                    {chapter.subject}
                  </td>

                  <td className="px-5 py-4 text-sm text-white/75">
                    {chapter.totalQuestions}
                  </td>

                  <td className="px-5 py-4 text-sm text-white/75">
                    #{chapter.order}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-100 transition hover:bg-cyan-400/15">
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/10 text-red-100 transition hover:bg-red-400/15">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
