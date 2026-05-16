import { firestoreService, where, orderBy } from '@/services/firestore.service'
import { COLLECTIONS } from '@/firebase/collections'
import type { Chapter } from '@/types/subject.types'

export const chaptersService = {
  async getBySubject(subjectId: string): Promise<Chapter[]> {
    return firestoreService.queryDocuments<Chapter>(COLLECTIONS.CHAPTERS, [
      where('subjectId', '==', subjectId),
      where('isActive', '==', true),
      orderBy('order', 'asc'),
    ])
  },

  async getById(id: string): Promise<Chapter | null> {
    return firestoreService.getDocument<Chapter>(COLLECTIONS.CHAPTERS, id)
  },

  async create(data: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt' | 'questionCount'>) {
    return firestoreService.addDocument(COLLECTIONS.CHAPTERS, { ...data, questionCount: 0 })
  },

  async update(id: string, data: Partial<Chapter>) {
    return firestoreService.updateDocument(COLLECTIONS.CHAPTERS, id, data)
  },

  async delete(id: string) {
    return firestoreService.deleteDocument(COLLECTIONS.CHAPTERS, id)
  },
}
