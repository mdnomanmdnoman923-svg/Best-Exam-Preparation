// bep-full-project/src/features/chapters/components/ChapterList.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Filter,
  Grid3X3,
  List,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

import ChapterCard, {
  ChapterCardProps,
} from './ChapterCard';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export interface ChapterListProps {
  chapters: ChapterCardProps[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onChapterClick?: (id: string) => void;
  onPracticeClick?: (id: string) => void;
  className?: string;
}

type DifficultyFilter =
  | 'all'
  | 'easy'
  | 'medium'
  | 'hard';

type ViewMode =
  | 'grid'
  | 'list';

export default function ChapterList({
  chapters,
  loading = false,
  title = 'Smart Chapters',
  subtitle = 'বাংলা-first AI powered learning chapters',
  emptyTitle = 'কোনো chapter পাওয়া যায়নি',
  emptyDescription = 'Search বা filter পরিবর্তন করে আবার চেষ্টা করুন',
  onChapterClick,
  onPracticeClick,
  className = '',
}: ChapterListProps) {
  const [search, setSearch] =
    useState('');

  const [difficulty, setDifficulty] =
    useState<DifficultyFilter>('all');

  const [viewMode, setViewMode] =
    useState<ViewMode>('grid');

  const filteredChapters = useMemo(() => {
    return chapters.filter((chapter) => {
      const matchesSearch =
        `${chapter.title} ${chapter.subject} ${
          chapter.description || ''
        }`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === 'all'
          ? true
          : chapter.difficulty ===
            difficulty;

      return (
        matchesSearch &&
        matchesDifficulty
      );
    });
  }, [
    chapters,
    difficulty,
    search,
  ]);

  return (
    <div
      className={[
        'space-y-6',
        className,
      ].join(' ')}
    >
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="relative overflow-hidden p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

          <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                <Sparkles className="h-3.5 w-3.5" />
                BEP Chapter Explorer
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white">
                {title}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="premium">
                {chapters.length} Chapters
              </Badge>

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                <BookOpen className="h-4 w-4" />
                AI Ready
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="w-full max-w-xl">
              <Input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value,
                  )
                }
                placeholder="Chapter search করুন..."
                leftIcon={
                  <Search className="h-4 w-4" />
                }
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
                {(
                  [
                    'all',
                    'easy',
                    'medium',
                    'hard',
                  ] as DifficultyFilter[]
                ).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setDifficulty(
                        item,
                      )
                    }
                    className={[
                      'rounded-xl px-4 py-2 text-sm font-medium capitalize transition',
                      difficulty ===
                      item
                        ? 'bg-cyan-400/15 text-cyan-100'
                        : 'text-white/55 hover:text-white',
                    ].join(' ')}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
                <button
                  type="button"
                  onClick={() =>
                    setViewMode(
                      'grid',
                    )
                  }
                  className={[
                    'flex h-11 w-11 items-center justify-center rounded-xl transition',
                    viewMode ===
                    'grid'
                      ? 'bg-cyan-400/15 text-cyan-100'
                      : 'text-white/55 hover:text-white',
                  ].join(' ')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setViewMode(
                      'list',
                    )
                  }
                  className={[
                    'flex h-11 w-11 items-center justify-center rounded-xl transition',
                    viewMode ===
                    'list'
                      ? 'bg-cyan-400/15 text-cyan-100'
                      : 'text-white/55 hover:text-white',
                  ].join(' ')}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <Button
                variant="secondary"
                leftIcon={
                  <Filter className="h-4 w-4" />
                }
              >
                Filters
              </Button>

              <Button
                variant="ghost"
                leftIcon={
                  <SlidersHorizontal className="h-4 w-4" />
                }
              >
                Sort
              </Button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div
          className={[
            'grid gap-6',
            viewMode === 'grid'
              ? 'md:grid-cols-2 xl:grid-cols-3'
              : 'grid-cols-1',
          ].join(' ')}
        >
          {[...Array(6)].map(
            (_, index) => (
              <div
                key={index}
                className="h-[520px] animate-pulse rounded-[30px] border border-white/10 bg-white/[0.04]"
              />
            ),
          )}
        </div>
      ) : filteredChapters.length > 0 ? (
        <motion.div
          layout
          className={[
            'grid gap-6',
            viewMode === 'grid'
              ? 'md:grid-cols-2 xl:grid-cols-3'
              : 'grid-cols-1',
          ].join(' ')}
        >
          {filteredChapters.map(
            (chapter) => (
              <motion.div
                key={chapter.id}
                layout
              >
                <ChapterCard
                  {...chapter}
                  onClick={
                    onChapterClick
                  }
                  onPractice={
                    onPracticeClick
                  }
                  className={
                    viewMode ===
                    'list'
                      ? 'xl:flex xl:h-full xl:flex-row [&>div>div:first-child]:xl:w-[340px] [&>div>div:last-child]:xl:flex-1'
                      : ''
                  }
                />
              </motion.div>
            ),
          )}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-white/10 bg-white/[0.04] px-6 py-20 text-center backdrop-blur-2xl">
          <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.05] text-cyan-100">
            <BookOpen className="h-11 w-11" />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            {emptyTitle}
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-7 text-white/60">
            {emptyDescription}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => {
                setSearch('');
                setDifficulty(
                  'all',
                );
              }}
            >
              Reset Filters
            </Button>

            <Button variant="secondary">
              Explore Subjects
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
