import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type QueryConstraint,
} from '@/firebase/firestore'
import type { DocumentData } from 'firebase/firestore'

export const firestoreService = {
  async getDocument<T>(collectionName: string, id: string): Promise<T | null> {
    const ref = doc(db, collectionName, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() } as T
  },

  async setDocument<T extends DocumentData>(
    collectionName: string,
    id: string,
    data: T,
    merge = true
  ) {
    const ref = doc(db, collectionName, id)
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge })
  },

  async updateDocument<T extends Partial<DocumentData>>(
    collectionName: string,
    id: string,
    data: T
  ) {
    const ref = doc(db, collectionName, id)
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
  },

  async addDocument<T extends DocumentData>(collectionName: string, data: T) {
    const ref = collection(db, collectionName)
    const docRef = await addDoc(ref, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  },

  async deleteDocument(collectionName: string, id: string) {
    const ref = doc(db, collectionName, id)
    await deleteDoc(ref)
  },

  async queryDocuments<T>(
    collectionName: string,
    constraints: QueryConstraint[]
  ): Promise<T[]> {
    const ref = collection(db, collectionName)
    const q = query(ref, ...constraints)
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
  },
}

// Re-export query helpers for use in services
export { where, orderBy, limit }
