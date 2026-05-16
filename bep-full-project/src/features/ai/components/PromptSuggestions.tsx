// bep-full-project/src/features/ai/components/PromptSuggestions.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Calculator,
  ChevronRight,
  FileQuestion,
  FlaskConical,
  Lightbulb,
  Sparkles,
  Target,
} from 'lucide-react';

export interface PromptSuggestion {
  id: string;
  title: string;
  prompt: string;
  description?: string;
  icon?: React.ReactNode;
  category?: string;
}

interface PromptSuggestionsProps {
  suggestions?: PromptSuggestion[];
  title?: string;
  subtitle?: string;
  compact?: boolean;
  loading?: boolean;
  onSelect: (prompt: string) => void;
}

const defaultSuggestions: PromptSuggestion[] = [
  {
    id: 'physics-explanation',
    title: 'Physics Explanation',
    prompt:
      'নিউটনের দ্বিতীয় সূত্র সহজভাবে উদাহরণসহ বুঝিয়ে দাও',
    description:
      'বাংলায় concept explanation এবং real-life example',
    category: 'Physics',
    icon: <Target className="h-5 w-5" />,
  },

  {
    id: 'math-solution',
    title: 'Step-by-step Math',
    prompt:
      'Quadratic equation step by step solve করে দেখাও',
    description:
      'পূর্ণ সমাধান এবং shortcut technique',
    category: 'Mathematics',
    icon: <Calculator className="h-5 w-5" />,
  },

  {
    id: 'chemistry-help',
    title: 'Chemistry Concept',
    prompt:
      'রাসায়নিক বন্ধন সহজভাবে explain করো',
    description:
      'Board exam friendly explanation',
    category: 'Chemistry',
    icon: <FlaskConical className="h-5 w-5" />,
  },

  {
    id: 'mcq-practice',
    title: 'MCQ Practice',
    prompt:
      'আমাকে HSC Biology থেকে ৫টি MCQ practice দাও',
    description:
      'Instant answer এবং explanation সহ',
    category: 'Practice',
    icon: <FileQuestion className="h-5 w-5" />,
  },

  {
    id: 'ai-study-plan',
    title: 'AI Study Plan',
    prompt:
      'আমার জন্য ৩০ দিনের smart study routine তৈরি করো',
    description:
      'Daily task এবং productivity strategy',
    category: 'Productivity',
    icon: <Brain className="h-5 w-5" />,
  },

  {
    id: 'shortcut-tricks',
    title: 'Shortcut Tricks',
    prompt:
      'Admission math এর জন্য shortcut techniques দাও',
    description:
      'Fast solving tricks এবং hacks',
    category: 'Admission',
    icon: <Lightbulb className="h-5 w-5" />,
  },
];

export default function PromptSuggestions({
  suggestions = defaultSuggestions,
  title = 'Smart Prompt Suggestions',
  subtitle = 'এক ক্লিকে AI tutor কে smart instruction দিন',
  compact = false,
  loading = false,
  onSelect,
}: PromptSuggestionsProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
      <div className="border-b border-white/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
              <Sparkles className="h-3.5 w-3.5" />
              AI Suggestions
            </div>

            <h2 className="text-xl font-bold tracking-tight text-white">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/60">
              {subtitle}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-100">
            <Brain className="h-3.5 w-3.5" />
            Bengali-first AI
          </div>
        </div>
      </div>

      <div
        className={[
          'grid gap-4 p-5',
          compact
            ? 'md:grid-cols-2'
            : 'md:grid-cols-2 xl:grid-cols-3',
        ].join(' ')}
      >
        {loading
          ? [...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]"
              />
            ))
          : suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.id}
                type="button"
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                onClick={() =>
                  onSelect(suggestion.prompt)
                }
                className={[
                  'group relative overflow-hidden rounded-3xl border border-white/10',
                  'bg-[#08111F]/70 p-5 text-left transition duration-300',
                  'hover:border-cyan-400/20 hover:bg-white/[0.05]',
                  'hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]',
                ].join(' ')}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_30%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-100 transition group-hover:scale-105">
                      {suggestion.icon}
                    </div>

                    {suggestion.category && (
                      <div className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/55">
                        {suggestion.category}
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <h3 className="text-lg font-bold tracking-tight text-white transition group-hover:text-cyan-100">
                      {suggestion.title}
                    </h3>

                    {suggestion.description && (
                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {suggestion.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="line-clamp-3 text-sm leading-6 text-white/80">
                      {suggestion.prompt}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
                      Try prompt
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/55 transition group-hover:border-cyan-400/20 group-hover:bg-cyan-400/10 group-hover:text-cyan-100">
                      <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
      </div>
    </div>
  );
}
