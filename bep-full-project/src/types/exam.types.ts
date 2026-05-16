import type { Timestamp } from 'firebase/firestore'

export interface MockTest {
  id: string
  title: string
  description: string | null
  subjectId: string | null
  questionIds: string[]
  totalQuestions: number
  duration: number          // minutes
  passMark: number          // percentage
  isActive: boolean
  isPremium: boolean
  attemptCount: number
  createdBy: string         // admin uid
  scheduledAt: Timestamp | null
  expiresAt: Timestamp | null
  createdAt: Timestamp
}

export interface ExamSession {
  examId: string
  questions: import('./question.types').Question[]
  currentIndex: number
  answers: Record<string, number | null>
  flagged: string[]
  startTime: number         // Date.now()
  duration: number          // minutes
  status: 'active' | 'paused' | 'reviewing' | 'submitted'
}
