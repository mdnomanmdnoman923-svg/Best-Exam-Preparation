// src/services/firestore.service.ts

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase/config';

export class FirestoreService {
  static async create<T>(
    collectionName: string,
    data: T,
    customId?: string,
  ) {
    if (customId) {
      const ref = doc(db, collectionName, customId);

      await setDoc(ref, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return customId;
    }

    const ref = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  }

  static async update<T>(
    collectionName: string,
    id: string,
    data: Partial<T>,
  ) {
    const ref = doc(db, collectionName, id);

    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  static async remove(collectionName: string, id: string) {
    const ref = doc(db, collectionName, id);
    await deleteDoc(ref);
  }

  static async getById<T>(
    collectionName: string,
    id: string,
  ): Promise<T | null> {
    const ref = doc(db, collectionName, id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as T;
  }

  static async getAll<T>(
    collectionName: string,
    constraints: QueryConstraint[] = [],
  ): Promise<T[]> {
    const ref = collection(db, collectionName);
    const q = query(ref, ...constraints);

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    })) as T[];
  }

  static async getLatest<T>(
    collectionName: string,
    field = 'createdAt',
    take = 10,
  ): Promise<T[]> {
    return this.getAll<T>(collectionName, [
      orderBy(field, 'desc'),
      limit(take),
    ]);
  }

  static async where<T>(
    collectionName: string,
    field: string,
    operator: any,
    value: any,
  ): Promise<T[]> {
    return this.getAll<T>(collectionName, [
      where(field, operator, value),
    ]);
  }

  static subscribe<T>(
    collectionName: string,
    callback: (data: T[]) => void,
    constraints: QueryConstraint[] = [],
  ) {
    const ref = collection(db, collectionName);
    const q = query(ref, ...constraints);

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      })) as T[];

      callback(data);
    });
  }

  static subscribeDocument<T>(
    collectionName: string,
    id: string,
    callback: (data: T | null) => void,
  ) {
    const ref = doc(db, collectionName, id);

    return onSnapshot(ref, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback({
        id: snapshot.id,
        ...snapshot.data(),
      } as T);
    });
  }

  static async batchCreate(
    collectionName: string,
    items: DocumentData[],
  ) {
    await Promise.all(
      items.map((item) =>
        this.create(collectionName, item),
      ),
    );
  }
}
