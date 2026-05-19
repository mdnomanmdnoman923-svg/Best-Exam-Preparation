// bep-full-project/src/store/exam.store.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ExamStatus = 'idle' | 'loading' | 'running' | 'paused' | 'completed';
export type ExamQuestionType = 'mcq' | 'written' | 'cq';

export interface ExamOption {
  id: string;
  label: string;
  value: string;
}

export interface ExamQuestion {
  id: string;
  title?: string;
  question: string;
  type: ExamQuestionType;
  options?: ExamOption[];
  correctOptionId?: string;
  explanation?: string;
  marks: number;
  bookmarked?: boolean;
  flagged?: boolean;
}

export interface ExamPaper {
  id: string;
  title: string;
  subject: string;
  chapter?: string;
  durationMinutes: number;
  totalMarks: number;
  instructions?: string[];
  premium?: boolean;
  questions: ExamQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamAttempt {
  examId: string;
  startedAt?: string;
  submittedAt?: string;
  timeLeftSeconds: number;
  status: ExamStatus;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  markedForReview: string[];
  bookmarkedQuestions: string[];
  flaggedQuestions: string[];
  score?: number;
  totalAnswered?: number;
  totalQuestions?: number;
}

interface ExamState {
  exams: ExamPaper[];
  activeExamId: string | null;
  attempt: ExamAttempt | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;

  searchQuery: string;
  subjectFilter: string;
  statusFilter: 'all' | 'upcoming' | 'live' | 'completed';
  difficultyFilter: 'all' | 'easy' | 'medium' | 'hard';

  setExams: (exams: ExamPaper[]) => void;
  upsertExam: (exam: ExamPaper) => void;
  removeExam: (examId: string) => void;

  setActiveExamId: (examId: string | null) => void;
  startAttempt: (examId: string, timeLeftSeconds?: number) => void;
  resumeAttempt: () => void;
  pauseAttempt: () => void;
  resetAttempt: () => void;

  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: string, answer: string) => void;
  clearAnswer: (questionId: string) => void;
  clearAllAnswers: () => void;

  toggleQuestionBookmark: (questionId: string) => void;
  toggleQuestionFlag: (questionId: string) => void;
  toggleMarkedForReview: (questionId: string) => void;

  setTimeLeftSeconds: (seconds: number) => void;
  addTimeSeconds: (seconds: number) => void;
  subtractTimeSeconds: (seconds: number) => void;

  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;

  setSearchQuery: (query: string) => void;
  setSubjectFilter: (subject: string) => void;
  setStatusFilter: (status: 'all' | 'upcoming' | 'live' | 'completed') => void;
  setDifficultyFilter: (difficulty: 'all' | 'easy' | 'medium' | 'hard') => void;

  submitAttempt: (payload?: {
    score?: number;
    totalAnswered?: number;
    totalQuestions?: number;
  }) => void;

  markExamCompleted: () => void;

  getActiveExam: () => ExamPaper | null;
  getCurrentQuestion: () => ExamQuestion | null;
  getProgressPercent: () => number;
  getAnsweredCount: () => number;
  getBookmarkedCount: () => number;
  getFlaggedCount: () => number;
}

const initialAttempt = (examId: string, durationMinutes: number): ExamAttempt => ({
  examId,
  startedAt: new Date().toISOString(),
  timeLeftSeconds: durationMinutes * 60,
  status: 'running',
  currentQuestionIndex: 0,
  answers: {},
  markedForReview: [],
  bookmarkedQuestions: [],
  flaggedQuestions: [],
});

const initialState = {
  exams: [],
  activeExamId: null,
  attempt: null,
  loading: false,
  submitting: false,
  error: null,

  searchQuery: '',
  subjectFilter: '',
  statusFilter: 'all' as const,
  difficultyFilter: 'all' as const,
};

function sortByUpdatedAt(items: ExamPaper[]) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
    const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
    return bTime - aTime;
  });
}

function uniqueList(items: string[]) {
  return Array.from(new Set(items));
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setExams: (exams) => {
        set({ exams: sortByUpdatedAt(exams) });
      },

      upsertExam: (exam) => {
        set((state) => {
          const index = state.exams.findIndex((item) => item.id === exam.id);
          const next = [...state.exams];

          if (index >= 0) {
            next[index] = { ...next[index], ...exam };
          } else {
            next.push(exam);
          }

          return { exams: sortByUpdatedAt(next) };
        });
      },

      removeExam: (examId) => {
        set((state) => ({
          exams: state.exams.filter((item) => item.id !== examId),
          activeExamId: state.activeExamId === examId ? null : state.activeExamId,
          attempt: state.attempt?.examId === examId ? null : state.attempt,
        }));
      },

      setActiveExamId: (examId) => {
        set({ activeExamId: examId });
      },

      startAttempt: (examId, timeLeftSeconds) => {
        const exam = get().exams.find((item) => item.id === examId);

        if (!exam) {
          set({ error: 'Exam not found.' });
          return;
        }

        const nextAttempt: ExamAttempt = {
          examId,
          startedAt: new Date().toISOString(),
          timeLeftSeconds:
            typeof timeLeftSeconds === 'number'
              ? timeLeftSeconds
              : exam.durationMinutes * 60,
          status: 'running',
          currentQuestionIndex: 0,
          answers: {},
          markedForReview: [],
          bookmarkedQuestions: [],
          flaggedQuestions: [],
        };

        set({
          activeExamId: examId,
          attempt: nextAttempt,
          error: null,
        });
      },

      resumeAttempt: () => {
        set((state) => {
          if (!state.attempt) return state;
          return {
            attempt: {
              ...state.attempt,
              status: 'running',
            },
          };
        });
      },

      pauseAttempt: () => {
        set((state) => {
          if (!state.attempt) return state;
          return {
            attempt: {
              ...state.attempt,
              status: 'paused',
            },
          };
        });
      },

      resetAttempt: () => {
        set((state) => ({
          attempt: state.activeExamId
            ? null
            : null,
          submitting: false,
          error: null,
        }));
      },

      setCurrentQuestionIndex: (index) => {
        set((state) => {
          if (!state.attempt) return state;

          const activeExam = get().getActiveExam();
          const maxIndex = Math.max(0, (activeExam?.questions.length ?? 1) - 1);

          return {
            attempt: {
              ...state.attempt,
              currentQuestionIndex: Math.min(Math.max(index, 0), maxIndex),
            },
          };
        });
      },

      setAnswer: (questionId, answer) => {
        set((state) => {
          if (!state.attempt) return state;

          return {
            attempt: {
              ...state.attempt,
              answers: {
                ...state.attempt.answers,
                [questionId]: answer,
              },
            },
          };
        });
      },

      clearAnswer: (questionId) => {
        set((state) => {
          if (!state.attempt) return state;

          const nextAnswers = { ...state.attempt.answers };
          delete nextAnswers[questionId];

          return {
            attempt: {
              ...state.attempt,
              answers: nextAnswers,
            },
          };
        });
      },

      clearAllAnswers: () => {
        set((state) => {
          if (!state.attempt) return state;

          return {
            attempt: {
              ...state.attempt,
              answers: {},
              markedForReview: [],
              bookmarkedQuestions: [],
              flaggedQuestions: [],
            },
          };
        });
      },

      toggleQuestionBookmark: (questionId) => {
        set((state) => {
          if (!state.attempt) return state;

          const hasBookmark = state.attempt.bookmarkedQuestions.includes(questionId);

          return {
            attempt: {
              ...state.attempt,
              bookmarkedQuestions: hasBookmark
                ? state.attempt.bookmarkedQuestions.filter((id) => id !== questionId)
                : [...state.attempt.bookmarkedQuestions, questionId],
            },
          };
        });
      },

      toggleQuestionFlag: (questionId) => {
        set((state) => {
          if (!state.attempt) return state;

          const hasFlag = state.attempt.flaggedQuestions.includes(questionId);

          return {
            attempt: {
              ...state.attempt,
              flaggedQuestions: hasFlag
                ? state.attempt.flaggedQuestions.filter((id) => id !== questionId)
                : [...state.attempt.flaggedQuestions, questionId],
            },
          };
        });
      },

      toggleMarkedForReview: (questionId) => {
        set((state) => {
          if (!state.attempt) return state;

          const isMarked = state.attempt.markedForReview.includes(questionId);

          return {
            attempt: {
              ...state.attempt,
              markedForReview: isMarked
                ? state.attempt.markedForReview.filter((id) => id !== questionId)
                : [...state.attempt.markedForReview, questionId],
            },
          };
        });
      },

      setTimeLeftSeconds: (seconds) => {
        set((state) => {
          if (!state.attempt) return state;

          return {
            attempt: {
              ...state.attempt,
              timeLeftSeconds: Math.max(0, seconds),
            },
          };
        });
      },

      addTimeSeconds: (seconds) => {
        set((state) => {
          if (!state.attempt) return state;

          return {
            attempt: {
              ...state.attempt,
              timeLeftSeconds: Math.max(0, state.attempt.timeLeftSeconds + seconds),
            },
          };
        });
      },

      subtractTimeSeconds: (seconds) => {
        set((state) => {
          if (!state.attempt) return state;

          return {
            attempt: {
              ...state.attempt,
              timeLeftSeconds: Math.max(0, state.attempt.timeLeftSeconds - seconds),
            },
          };
        });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setSubmitting: (submitting) => {
        set({ submitting });
      },

      setError: (error) => {
        set({ error });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setSubjectFilter: (subject) => {
        set({ subjectFilter: subject });
      },

      setStatusFilter: (status) => {
        set({ statusFilter: status });
      },

      setDifficultyFilter: (difficulty) => {
        set({ difficultyFilter: difficulty });
      },

      submitAttempt: (payload) => {
        set((state) => {
          if (!state.attempt) return state;

          return {
            submitting: false,
            attempt: {
              ...state.attempt,
              status: 'completed',
              submittedAt: new Date().toISOString(),
              score: payload?.score,
              totalAnswered: payload?.totalAnswered ?? Object.keys(state.attempt.answers).length,
              totalQuestions: payload?.totalQuestions,
            },
          };
        });
      },

      markExamCompleted: () => {
        set((state) => {
          if (!state.attempt) return state;

          return {
            attempt: {
              ...state.attempt,
              status: 'completed',
              submittedAt: new Date().toISOString(),
            },
          };
        });
      },

      getActiveExam: () => {
        const { exams, activeExamId } = get();
        return exams.find((exam) => exam.id === activeExamId) ?? null;
      },

      getCurrentQuestion: () => {
        const { attempt } = get();
        const exam = get().getActiveExam();

        if (!attempt || !exam) return null;

        return exam.questions[attempt.currentQuestionIndex] ?? null;
      },

      getProgressPercent: () => {
        const { attempt } = get();
        const exam = get().getActiveExam();

        if (!attempt || !exam || exam.questions.length === 0) return 0;

        const answered = Object.keys(attempt.answers).length;
        return Math.round((answered / exam.questions.length) * 100);
      },

      getAnsweredCount: () => {
        const { attempt } = get();
        if (!attempt) return 0;
        return Object.keys(attempt.answers).length;
      },

      getBookmarkedCount: () => {
        const { attempt } = get();
        if (!attempt) return 0;
        return attempt.bookmarkedQuestions.length;
      },

      getFlaggedCount: () => {
        const { attempt } = get();
        if (!attempt) return 0;
        return attempt.flaggedQuestions.length;
      },
    }),
    {
      name: 'bep-exam-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeExamId: state.activeExamId,
        attempt: state.attempt,
        searchQuery: state.searchQuery,
        subjectFilter: state.subjectFilter,
        statusFilter: state.statusFilter,
        difficultyFilter: state.difficultyFilter,
      }),
    },
  ),
);

/* -------------------------------------------------------------------------- */
/*                               Helper Selectors                             */
/* -------------------------------------------------------------------------- */

export const examSelectors = {
  exams: (state: ExamState) => state.exams,
  activeExamId: (state: ExamState) => state.activeExamId,
  attempt: (state: ExamState) => state.attempt,
  loading: (state: ExamState) => state.loading,
  submitting: (state: ExamState) => state.submitting,
  error: (state: ExamState) => state.error,
  searchQuery: (state: ExamState) => state.searchQuery,
  subjectFilter: (state: ExamState) => state.subjectFilter,
  statusFilter: (state: ExamState) => state.statusFilter,
  difficultyFilter: (state: ExamState) => state.difficultyFilter,
  progressPercent: (state: ExamState) => {
    const attempt = state.attempt;
    const activeExam = state.exams.find((exam) => exam.id === state.activeExamId);

    if (!attempt || !activeExam || activeExam.questions.length === 0) return 0;

    return Math.round((Object.keys(attempt.answers).length / activeExam.questions.length) * 100);
  },
};

/* -------------------------------------------------------------------------- */
/*                              Utility Functions                              */
/* -------------------------------------------------------------------------- */

export function createEmptyAttempt(examId: string, durationMinutes = 0): ExamAttempt {
  return initialAttempt(examId, durationMinutes);
}

export function normalizeExamQuestions(questions: ExamQuestion[]) {
  return questions.map((question) => ({
    ...question,
    options: question.options ?? [],
    bookmarked: Boolean(question.bookmarked),
    flagged: Boolean(question.flagged),
  }));
}

export function uniqueQuestionIds(ids: string[]) {
  return uniqueList(ids);
}
