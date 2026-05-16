import { firestoreService, where, orderBy } from '@/services/firestore.service'
import { COLLECTIONS } from '@/firebase/collections'
import type { Subject } from '@/types/subject.types'
import type { EducationLevel } from '@/types/profile.types'

export const subjectsService = {
  async getAll(): Promise<Subject[]> {
    return firestoreService.queryDocuments<Subject>(COLLECTIONS.SUBJECTS, [
      where('isActive', '==', true),
      orderBy('order', 'asc'),
    ])
  },

  async getByLevel(level: EducationLevel): Promise<Subject[]> {
    return firestoreService.queryDocuments<Subject>(COLLECTIONS.SUBJECTS, [
      where('level', 'array-contains', level),
      where('isActive', '==', true),
      orderBy('order', 'asc'),
    ])
  },

  async getById(id: string): Promise<Subject | null> {
    return firestoreService.getDocument<Subject>(COLLECTIONS.SUBJECTS, id)
  },

  async create(data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt' | 'questionCount' | 'chapterCount'>) {
    return firestoreService.addDocument(COLLECTIONS.SUBJECTS, {
      ...data,
      questionCount: 0,
      chapterCount: 0,
    })
  },

  async update(id: string, data: Partial<Subject>) {
    return firestoreService.updateDocument(COLLECTIONS.SUBJECTS, id, data)
  },

  async delete(id: string) {
    return firestoreService.deleteDocument(COLLECTIONS.SUBJECTS, id)
  },
}
