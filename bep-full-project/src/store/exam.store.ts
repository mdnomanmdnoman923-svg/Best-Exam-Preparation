import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ExamSession } from '@/types/exam.types'
import type { Question } from '@/types/question.types'

interface ExamState {
  session: ExamSession | null
  // Actions
  startSession: (examId: string, questions: Question[], duration: number) => void
  answerQuestion: (questionId: string, optionIndex: number | null) => void
  toggleFlag: (questionId: string) => void
  navigateTo: (index: number) => void
  submitSession: () => void
  resetSession: () => void
}

export const useExamStore = create<ExamState>()(
  devtools(
    (set, get) => ({
      session: null,

      startSession: (examId, questions, duration) => {
        set({
          session: {
            examId,
            questions,
            currentIndex: 0,
            answers: {},
            flagged: [],
            startTime: Date.now(),
            duration,
            status: 'active',
          },
        }, false, 'exam/start')
      },

      answerQuestion: (questionId, optionIndex) => {
        const s = get().session
        if (!s) return
        set({
          session: {
            ...s,
            answers: { ...s.answers, [questionId]: optionIndex },
          },
        }, false, 'exam/answer')
      },

      toggleFlag: (questionId) => {
        const s = get().session
        if (!s) return
        const flagged = s.flagged.includes(questionId)
          ? s.flagged.filter((id) => id !== questionId)
          : [...s.flagged, questionId]
        set({ session: { ...s, flagged } }, false, 'exam/flag')
      },

      navigateTo: (index) => {
        const s = get().session
        if (!s) return
        set({ session: { ...s, currentIndex: index } }, false, 'exam/navigate')
      },

      submitSession: () => {
        const s = get().session
        if (!s) return
        set({ session: { ...s, status: 'submitted' } }, false, 'exam/submit')
      },

      resetSession: () => set({ session: null }, false, 'exam/reset'),
    }),
    { name: 'ExamStore' }
  )
)
