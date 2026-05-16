// bep-full-project/src/features/admin/components/QuestionManager.tsx

import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Edit3,
  Filter,
  Plus,
  Search,
  Shuffle,
  Trash2,
  Clock3,
  CircleHelp,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

type QuestionDifficulty = 'easy' | 'medium' | 'hard';

interface QuestionItem {
  id: string;
  subject: string;
  chapter: string;
  question: string;
  difficulty: QuestionDifficulty;
  options: string[];
  correctAnswer: string;
  status: 'draft' | 'published';
  createdAt: string;
}

const initialQuestions: QuestionItem[] = [
  {
    id: 'q-1001',
    subject: 'Physics',
    chapter: 'ভৌত রাশি',
    question: 'SI পদ্ধতিতে বলের একক কী?',
    difficulty: 'easy',
    options: ['Joule', 'Pascal', 'Newton', 'Watt'],
    correctAnswer: 'Newton',
    status: 'published',
    createdAt: '2026-05-10',
  },
  {
    id: 'q-1002',
    subject: 'Mathematics',
    chapter: 'বীজগণিত',
    question: 'x² - 5x + 6 = 0 সমীকরণের মূল কত?',
    difficulty: 'medium',
    options: ['2, 3', '1, 6', '-2, -3', '5, 6'],
    correctAnswer: '2, 3',
    status: 'published',
    createdAt: '2026-05-11',
  },
  {
    id: 'q-1003',
    subject: 'Chemistry',
    chapter: 'পরমাণুর গঠন',
    question: 'ইলেকট্রনের চার্জ কত?',
    difficulty: 'medium',
    options: [
      '-1.6 × 10⁻¹⁹ C',
      '+1.6 × 10⁻¹⁹ C',
      '0 C',
      '1 Coulomb',
    ],
    correctAnswer: '-1.6 × 10⁻¹⁹ C',
    status: 'draft',
    createdAt: '2026-05-12',
  },
];

function difficultyClass(difficulty: QuestionDifficulty) {
  switch (difficulty) {
    case 'easy':
      return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100';
    case 'medium':
      return 'border-amber-400/20 bg-amber-400/10 text-amber-100';
    case 'hard':
      return 'border-red-400/20 bg-red-400/10 text-red-100';
    default:
      return 'border-white/10 bg-white/8 text-white/75';
  }
}

export default function QuestionManager() {
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [questions] = useState(initialQuestions);

  const subjects = useMemo(
    () => ['all', ...new Set(questions.map((q) => q.subject))],
    [questions],
  );

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch = `${question.question} ${question.subject} ${question.chapter}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesSubject =
        subjectFilter === 'all' || question.subject === subjectFilter;

      const matchesStatus =
        statusFilter === 'all' || question.status === statusFilter;

      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [questions, search, subjectFilter, statusFilter]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
            <CircleHelp className="h-3.5 w-3.5" />
            Question Bank Manager
          </div>

          <h2 className="text-2xl font-bold text-white">
            প্রশ্ন পরিচালনা
          </h2>

          <p className="mt-2 text-sm text-white/60">
            MCQ, SQ, CQ প্রশ্ন add, edit এবং publish করুন
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" leftIcon={<Shuffle className="h-4 w-4" />}>
            Import
          </Button>

          <Button leftIcon={<Plus className="h-4 w-4" />}>
            নতুন প্রশ্ন
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <Input
          placeholder="প্রশ্ন search করুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />

        <div className="relative">
          <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="h-12 w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.04] px-11 text-sm text-white outline-none transition focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/15"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject} className="bg-[#0B1220]">
                {subject === 'all' ? 'সব Subject' : subject}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Clock3 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'all' | 'draft' | 'published')
            }
            className="h-12 w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.04] px-11 text-sm text-white outline-none transition focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/15"
          >
            <option value="all" className="bg-[#0B1220]">
              সব Status
            </option>
            <option value="draft" className="bg-[#0B1220]">
              Draft
            </option>
            <option value="published" className="bg-[#0B1220]">
              Published
            </option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white/[0.03]">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-white/45">
                  Question
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-white/45">
                  Subject
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-white/45">
                  Difficulty
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-white/45">
                  Status
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-widest text-white/45">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredQuestions.map((question) => (
                <tr
                  key={question.id}
                  className="border-t border-white/5 transition hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                        <BookOpen className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h4 className="line-clamp-2 text-sm font-semibold leading-6 text-white">
                          {question.question}
                        </h4>

                        <p className="mt-1 text-xs text-white/45">
                          {question.chapter} • {question.id}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {question.options.slice(0, 2).map((option, index) => (
                            <Badge key={`${question.id}-${index}`} variant="secondary">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5 text-sm text-white/75">
                    {question.subject}
                  </td>

                  <td className="px-5 py-5">
                    <span
                      className={[
                        'inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest',
                        difficultyClass(question.difficulty),
                      ].join(' ')}
                    >
                      {question.difficulty}
                    </span>
                  </td>

                  <td className="px-5 py-5">
                    <Badge
                      variant={question.status === 'published' ? 'success' : 'warning'}
                      dot
                    >
                      {question.status}
                    </Badge>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-100 transition hover:bg-cyan-400/15"
                        aria-label="Edit question"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/10 text-red-100 transition hover:bg-red-400/15"
                        aria-label="Delete question"
                      >
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

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="text-sm text-white/65">
          মোট প্রশ্ন: <span className="font-semibold text-white">{filteredQuestions.length}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-white/45">
          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
          প্রশ্ন ব্যাঙ্ক synced এবং ready
        </div>
      </div>
    </div>
  );
}
