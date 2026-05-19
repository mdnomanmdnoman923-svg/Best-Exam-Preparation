// bep-full-project/src/features/subjects/components/SubjectProgressCard.tsx

import { motion } from 'framer-motion';

import {
  BookOpen,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from 'lucide-react';

interface SubjectProgressCardProps {
  subjectName?: string;

  progress?: number;

  totalChapters?: number;
  completedChapters?: number;

  totalQuestions?: number;
  solvedQuestions?: number;

  studyHours?: number;

  loading?: boolean;
}

export default function SubjectProgressCard({
  subjectName = 'Mathematics',

  progress = 0,

  totalChapters = 0,
  completedChapters = 0,

  totalQuestions = 0,
  solvedQuestions = 0,

  studyHours = 0,

  loading = false,
}: SubjectProgressCardProps) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
        <div className="animate-pulse">
          <div className="h-6 w-40 rounded bg-white/10" />

          <div className="mt-6 h-3 w-full rounded-full bg-white/10" />

          <div className="mt-6 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-24 rounded-2xl bg-white/[0.03]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
      whileHover={{
        y: -2,
      }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-cyan-300">
            Subject Progress
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            {subjectName}
          </h2>
        </div>

        <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
          <TrendingUp size={22} />
        </div>
      </div>

      {/* Progress */}

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-white/60">
            Overall Completion
          </span>

          <span className="text-sm font-semibold text-cyan-300">
            {progress}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.8,
            }}
            className="h-full rounded-full bg-cyan-400"
          />
        </div>
      </div>

      {/* Stats */}

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Chapters */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/10 p-2 text-violet-300">
              <BookOpen size={18} />
            </div>

            <div>
              <p className="text-xs text-white/50">
                Chapters
              </p>

              <h3 className="mt-1 text-lg font-bold text-white">
                {completedChapters}/{totalChapters}
              </h3>
            </div>
          </div>
        </div>

        {/* Questions */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-300">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <p className="text-xs text-white/50">
                Questions Solved
              </p>

              <h3 className="mt-1 text-lg font-bold text-white">
                {solvedQuestions}/{totalQuestions}
              </h3>
            </div>
          </div>
        </div>

        {/* Study Time */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-300">
              <Clock3 size={18} />
            </div>

            <div>
              <p className="text-xs text-white/50">
                Study Time
              </p>

              <h3 className="mt-1 text-lg font-bold text-white">
                {studyHours} Hours
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}

      <div className="mt-6 border-t border-white/10 pt-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/55">
            Keep practicing daily to improve your performance.
          </p>

          <button
            type="button"
            className="rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.03] hover:bg-cyan-300"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.section>
  );
}
