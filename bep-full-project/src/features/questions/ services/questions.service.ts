import {
  db, collection, doc, getDoc, getDocs, addDoc, updateDoc,
  deleteDoc, query, where, orderBy, limit, serverTimestamp,
  increment, writeBatch,
} from '@/firebase/firestore'
import { firestoreService } from '@/services/firestore.service'
import { COLLECTIONS } from '@/firebase/collections'
import type { Question, Attempt, ExamAttempt, Bookmark } from '@/types/question.types'
import type { Difficulty } from '@/types/question.types'

interface QuestionsFilter {
  subjectId?: string
  chapterId?: string
  difficulty?: Difficulty
  limitTo?: number
}

export const questionsService = {
  async getFiltered(filter: QuestionsFilter): Promise<Question[]> {
    const constraints = [where('isActive', '==', true)]
    if (filter.subjectId) constraints.push(where('subjectId', '==', filter.subjectId))
    if (filter.chapterId) constraints.push(where('chapterId', '==', filter.chapterId))
    if (filter.difficulty) constraints.push(where('difficulty', '==', filter.difficulty))
    constraints.push(orderBy('createdAt', 'desc'))
    if (filter.limitTo) constraints.push(limit(filter.limitTo))

    return firestoreService.queryDocuments<Question>(COLLECTIONS.QUESTIONS, constraints)
  },

  async getById(id: string): Promise<Question | null> {
    return firestoreService.getDocument<Question>(COLLECTIONS.QUESTIONS, id)
  },

  async getByIds(ids: string[]): Promise<Question[]> {
    if (!ids.length) return []
    const promises = ids.map((id) =>
      getDoc(doc(db, COLLECTIONS.QUESTIONS, id)).then((snap) =>
        snap.exists() ? ({ id: snap.id, ...snap.data() } as Question) : null
      )
    )
    const results = await Promise.all(promises)
    return results.filter(Boolean) as Question[]
  },

  async create(data: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'attemptCount' | 'correctRate'>) {
    return firestoreService.addDocument(COLLECTIONS.QUESTIONS, {
      ...data,
      attemptCount: 0,
      correctRate: 0,
    })
  },

  async update(id: string, data: Partial<Question>) {
    return firestoreService.updateDocument(COLLECTIONS.QUESTIONS, id, data)
  },

  async delete(id: string) {
    return firestoreService.deleteDocument(COLLECTIONS.QUESTIONS, id)
  },

  async recordAttempt(attempt: Omit<Attempt, 'id' | 'createdAt'>) {
    const batch = writeBatch(db)
    // Add attempt doc
    const attemptRef = doc(collection(db, COLLECTIONS.ATTEMPTS))
    batch.set(attemptRef, { ...attempt, createdAt: serverTimestamp() })
    // Increment question stats
    const qRef = doc(db, COLLECTIONS.QUESTIONS, attempt.questionId)
    batch.update(qRef, {
      attemptCount: increment(1),
      correctRate: attempt.isCorrect ? increment(1) : increment(0),
    })
    await batch.commit()
  },

  async saveExamAttempt(attempt: Omit<ExamAttempt, 'id'>) {
    return firestoreService.addDocument(COLLECTIONS.ATTEMPTS, attempt)
  },

  async getUserAttempts(uid: string): Promise<ExamAttempt[]> {
    return firestoreService.queryDocuments<ExamAttempt>(COLLECTIONS.ATTEMPTS, [
      where('uid', '==', uid),
      orderBy('startedAt', 'desc'),
      limit(50),
    ])
  },

  // Bookmarks
  async getBookmarks(uid: string): Promise<Bookmark[]> {
    return firestoreService.queryDocuments<Bookmark>(COLLECTIONS.BOOKMARKS, [
      where('uid', '==', uid),
      orderBy('createdAt', 'desc'),
    ])
  },

  async addBookmark(uid: string, questionId: string, note = '') {
    return firestoreService.addDocument(COLLECTIONS.BOOKMARKS, { uid, questionId, note })
  },

  async removeBookmark(bookmarkId: string) {
    return firestoreService.deleteDocument(COLLECTIONS.BOOKMARKS, bookmarkId)
  },
}
