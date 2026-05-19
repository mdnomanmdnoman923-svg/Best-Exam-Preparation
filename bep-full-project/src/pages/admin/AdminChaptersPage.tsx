// bep-full-project/src/pages/admin/AdminChaptersPage.tsx

import { useCallback, useEffect, useMemo, useState } from 'react';

import { motion } from 'framer-motion';

import {
  BookOpen,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';

interface Chapter {
  id: string;

  name: string;
  description?: string;

  subjectName?: string;

  questionsCount?: number;

  createdAt?: string;
}

export default function AdminChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [deletingId, setDeletingId] = useState<
    string | null
  >(null);

  /* ---------------------------------------------------------------------- */
  /*                            Mock Load Data                              */
  /* ---------------------------------------------------------------------- */

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 700),
      );

      setChapters([
        {
          id: '1',

          name: 'Algebra Basics',

          description:
            'Introduction to algebraic expressions and equations.',

          subjectName: 'Mathematics',

          questionsCount: 120,

          createdAt: new Date().toISOString(),
        },

        {
          id: '2',

          name: 'Newton Laws',

          description:
            'Fundamentals of force and motion.',

          subjectName: 'Physics',

          questionsCount: 85,

          createdAt: new Date().toISOString(),
        },

        {
          id: '3',

          name: 'Organic Chemistry',

          description:
            'Basic carbon compounds and reactions.',

          subjectName: 'Chemistry',

          questionsCount: 96,

          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error(
        'Failed to load chapters',
        error,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ---------------------------------------------------------------------- */
  /*                             Delete Chapter                             */
  /* ---------------------------------------------------------------------- */

  const handleDeleteChapter = useCallback(
    async (chapterId: string) => {
      try {
        setDeletingId(chapterId);

        await new Promise((resolve) =>
          setTimeout(resolve, 500),
        );

        setChapters((prev) =>
          prev.filter(
            (chapter) =>
              chapter.id !== chapterId,
          ),
        );
      } catch (error) {
        console.error(
          'Failed to delete chapter',
          error,
        );
      } finally {
        setDeletingId(null);
      }
    },
    [],
  );

  /* ---------------------------------------------------------------------- */
  /*                              Filter Data                               */
  /* ---------------------------------------------------------------------- */

  const filteredChapters = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return chapters;
    }

    return chapters.filter((chapter) => {
      return (
        chapter.name
          .toLowerCase()
          .includes(query) ||
        chapter.subjectName
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [chapters, search]);

  /* ---------------------------------------------------------------------- */
  /*                                Loading                                 */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-300" />
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /*                                 Render                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="space-y-6"
    >
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Chapters Management
          </h1>

          <p className="mt-2 text-sm text-white/60">
            Manage all subjects chapters and question collections.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-cyan-300"
        >
          <Plus size={18} />

          Add Chapter
        </button>
      </div>

      {/* Search */}

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search chapters..."
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-12 pr-4 text-white outline-none transition-all duration-300 placeholder:text-white/35 focus:border-cyan-400/50"
        />
      </div>

      {/* Chapters Grid */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredChapters.map((chapter) => (
          <motion.article
            key={chapter.id}
            whileHover={{
              y: -3,
            }}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
          >
            {/* Top */}

            <div className="flex items-start justify-between gap-4">
              <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                <BookOpen size={22} />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-white/70 transition-all duration-300 hover:border-cyan-400/30 hover:text-cyan-300"
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  disabled={
                    deletingId === chapter.id
                  }
                  onClick={() =>
                    handleDeleteChapter(
                      chapter.id,
                    )
                  }
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition-all duration-300 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === chapter.id ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Content */}

            <div className="mt-5">
              <h2 className="text-xl font-bold text-white">
                {chapter.name}
              </h2>

              <p className="mt-2 text-sm text-white/55">
                {chapter.description}
              </p>
            </div>

            {/* Footer */}

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
              <div>
                <p className="text-xs text-white/45">
                  Subject
                </p>

                <h4 className="mt-1 text-sm font-semibold text-cyan-300">
                  {chapter.subjectName}
                </h4>
              </div>

              <div className="text-right">
                <p className="text-xs text-white/45">
                  Questions
                </p>

                <h4 className="mt-1 text-sm font-semibold text-white">
                  {chapter.questionsCount}
                </h4>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Empty State */}

      {!filteredChapters.length && (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
          <h3 className="text-xl font-bold text-white">
            No Chapters Found
          </h3>

          <p className="mt-2 text-sm text-white/55">
            Try changing your search keyword.
          </p>
        </div>
      )}
    </motion.section>
  );
}
