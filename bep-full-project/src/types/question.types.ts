import type { Timestamp } from 'firebase/firestore'

export type Difficulty = 'easy' | 'medium' | 'hard'
export type QuestionType = 'mcq' | 'written' | 'tfq'

export interface Question {
  id: string
  subjectId: string
  chapterId: string
  text: string              // Bengali question text
  options: QuestionOption[]
  correctIndex: number
  explanation: string | null
  difficulty: Difficulty
  type: QuestionType
  tags: string[]
  imageURL: string | null
  year: string | null       // e.g. "SSC 2023"
  isActive: boolean
  attemptCount: number
  correctRate: number       // 0-100
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface QuestionOption {
  index: number
  text: string
  imageURL?: string | null
}

export interface Attempt {
  id: string
  uid: string
  examId: string | null     // null for practice
  questionId: string
  selectedIndex: number | null
  isCorrect: boolean
  timeTaken: number         // seconds
  createdAt: Timestamp
}

export interface ExamAttempt {
  id: string
  uid: string
  examId: string
  examType: 'practice' | 'mock' | 'custom'
  subjectId: string | null
  chapterId: string | null
  questionIds: string[]
  answers: Record<string, number | null>  // questionId -> selectedIndex
  score: number
  totalQuestions: number
  correctCount: number
  wrongCount: number
  skippedCount: number
  timeTaken: number   // seconds
  startedAt: Timestamp
  completedAt: Timestamp | null
  status: 'in_progress' | 'completed' | 'abandoned'
}

export interface Bookmark {
  id: string
  uid: string
  questionId: string
  note: string | null
  createdAt: Timestamp
}
