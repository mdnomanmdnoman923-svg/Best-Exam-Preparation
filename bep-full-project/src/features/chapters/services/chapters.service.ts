// bep-full-project/src/features/chapters/services/chapters.service.ts

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
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

import { db } from '@/firebase/config';
import { collectionNames } from '@/firebase/collections';

export type ChapterDifficulty = 'easy' | 'medium' | 'hard';

export type ChapterStatus = 'draft' | 'published' | 'archived';

export interface ChapterDocument {
  id?: string;
  subjectId: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  thumbnail?: string;
  order: number;
  totalQuestions?: number;
  completedQuestions?: number;
  estimatedMinutes?: number;
  difficulty?: ChapterDifficulty;
  status?: ChapterStatus;
  premium?: boolean;
  locked?: boolean;
  featured?: boolean;
  aiSupported?: boolean;
  tags?: string[];
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface CreateChapterInput {
  subjectId: string;
  title: string;
  slug?: string;
  description?: string;
  content?: string;
  thumbnail?: string;
  order?: number;
  totalQuestions?: number;
  completedQuestions?: number;
  estimatedMinutes?: number;
  difficulty?: ChapterDifficulty;
  status?: ChapterStatus;
  premium?: boolean;
  locked?: boolean;
  featured?: boolean;
  aiSupported?: boolean;
  tags?: string[];
}

export interface UpdateChapterInput extends Partial<CreateChapterInput> {
  slug?: string;
}

const CHAPTERS_COLLECTION =
  (collectionNames as Record<string, string>).chapters ||
  'chapters';

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u0980-\u09FF]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeChapterInput(
  input: CreateChapterInput | UpdateChapterInput,
): Omit<ChapterDocument, 'id' | 'createdAt' | 'updatedAt'> {
  const title = input.title?.trim() || '';
  const slugSource = input.slug?.trim() || title;
  const slug = normalizeSlug(slugSource);

  return {
    subjectId: input.subjectId?.trim?.() || '',
    title,
    slug,
    description: input.description?.trim() || '',
    content: input.content?.trim() || '',
    thumbnail: input.thumbnail?.trim() || '',
    order: typeof input.order === 'number' ? input.order : 0,
    totalQuestions: input.totalQuestions ?? 0,
    completedQuestions: input.completedQuestions ?? 0,
    estimatedMinutes: input.estimatedMinutes ?? 0,
    difficulty: input.difficulty || 'medium',
    status: input.status || 'draft',
    premium: Boolean(input.premium),
    locked: Boolean(input.locked),
    featured: Boolean(input.featured),
    aiSupported: input.aiSupported !== false,
    tags: input.tags || [],
  };
}

function chapterCollectionRef() {
  return collection(db, CHAPTERS_COLLECTION);
}

function chapterDocRef(id: string) {
  return doc(db, CHAPTERS_COLLECTION, id);
}

export class ChaptersService {
  static async createChapter(
    input: CreateChapterInput,
    customId?: string,
  ): Promise<string> {
    const payload = normalizeChapterInput(input);

    if (!payload.subjectId) {
      throw new Error('subjectId is required');
    }

    if (!payload.title) {
      throw new Error('title is required');
    }

    if (customId) {
      const ref = chapterDocRef(customId);

      await setDoc(ref, {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return customId;
    }

    const ref = await addDoc(chapterCollectionRef(), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  }

  static async updateChapter(
    id: string,
    input: UpdateChapterInput,
  ): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    const ref = chapterDocRef(id);
    const payload = normalizeChapterInput(input);

    await updateDoc(ref, {
      ...payload,
      updatedAt: serverTimestamp(),
    });
  }

  static async deleteChapter(id: string): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    await deleteDoc(chapterDocRef(id));
  }

  static async getChapterById(
    id: string,
  ): Promise<ChapterDocument | null> {
    if (!id) return null;

    const snapshot = await getDoc(chapterDocRef(id));

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...(snapshot.data() as ChapterDocument),
    };
  }

  static async listChapters(
    constraints: QueryConstraint[] = [],
  ): Promise<ChapterDocument[]> {
    const q = query(chapterCollectionRef(), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...(item.data() as ChapterDocument),
    }));
  }

  static async listChaptersBySubject(
    subjectId: string,
    extraConstraints: QueryConstraint[] = [],
  ): Promise<ChapterDocument[]> {
    if (!subjectId) return [];

    return this.listChapters([
      where('subjectId', '==', subjectId),
      orderBy('order', 'asc'),
      ...extraConstraints,
    ]);
  }

  static async listPublishedChaptersBySubject(
    subjectId: string,
  ): Promise<ChapterDocument[]> {
    if (!subjectId) return [];

    return this.listChapters([
      where('subjectId', '==', subjectId),
      where('status', '==', 'published'),
      orderBy('order', 'asc'),
    ]);
  }

  static async listFeaturedChapters(
    take = 10,
  ): Promise<ChapterDocument[]> {
    return this.listChapters([
      where('featured', '==', true),
      where('status', '==', 'published'),
      orderBy('order', 'asc'),
      limit(take),
    ]);
  }

  static subscribeChapters(
    callback: (chapters: ChapterDocument[]) => void,
    constraints: QueryConstraint[] = [],
  ) {
    const q = query(chapterCollectionRef(), ...constraints);

    return onSnapshot(q, (snapshot) => {
      const chapters = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as ChapterDocument),
      }));

      callback(chapters);
    });
  }

  static subscribeChapter(
    id: string,
    callback: (chapter: ChapterDocument | null) => void,
  ) {
    const ref = chapterDocRef(id);

    return onSnapshot(ref, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback({
        id: snapshot.id,
        ...(snapshot.data() as ChapterDocument),
      });
    });
  }

  static async reorderChapters(
    subjectId: string,
    orderedChapterIds: string[],
  ): Promise<void> {
    if (!subjectId) {
      throw new Error('subjectId is required');
    }

    if (!Array.isArray(orderedChapterIds)) {
      throw new Error('orderedChapterIds must be an array');
    }

    const batch = writeBatch(db);

    orderedChapterIds.forEach((chapterId, index) => {
      const ref = chapterDocRef(chapterId);
      batch.update(ref, {
        order: index + 1,
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
  }

  static async duplicateChapter(
    chapterId: string,
    overrides: Partial<CreateChapterInput> = {},
  ): Promise<string> {
    const existing = await this.getChapterById(chapterId);

    if (!existing) {
      throw new Error('Chapter not found');
    }

    const source = normalizeChapterInput({
      subjectId: overrides.subjectId || existing.subjectId,
      title: overrides.title || `${existing.title} Copy`,
      slug: overrides.slug || `${existing.slug}-copy`,
      description: overrides.description ?? existing.description,
      content: overrides.content ?? existing.content,
      thumbnail: overrides.thumbnail ?? existing.thumbnail,
      order:
        overrides.order ??
        (typeof existing.order === 'number' ? existing.order + 1 : 1),
      totalQuestions:
        overrides.totalQuestions ?? existing.totalQuestions,
      completedQuestions:
        overrides.completedQuestions ?? 0,
      estimatedMinutes:
        overrides.estimatedMinutes ?? existing.estimatedMinutes,
      difficulty: overrides.difficulty || existing.difficulty || 'medium',
      status: overrides.status || 'draft',
      premium: overrides.premium ?? existing.premium,
      locked: overrides.locked ?? existing.locked,
      featured: overrides.featured ?? false,
      aiSupported: overrides.aiSupported ?? existing.aiSupported,
      tags: overrides.tags ?? existing.tags,
    });

    const ref = await addDoc(chapterCollectionRef(), {
      ...source,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  }

  static async setChapterStatus(
    id: string,
    status: ChapterStatus,
  ): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    await updateDoc(chapterDocRef(id), {
      status,
      updatedAt: serverTimestamp(),
    });
  }

  static async incrementQuestionCounts(
    id: string,
    delta = 1,
  ): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    const ref = chapterDocRef(id);

    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(ref);

      if (!snapshot.exists()) {
        throw new Error('Chapter not found');
      }

      const data = snapshot.data() as ChapterDocument;
      const totalQuestions = Math.max(
        0,
        Number(data.totalQuestions || 0) + delta,
      );

      transaction.update(ref, {
        totalQuestions,
        updatedAt: serverTimestamp(),
      });
    });
  }

  static async bulkDelete(ids: string[]): Promise<void> {
    if (!Array.isArray(ids) || ids.length === 0) return;

    const batch = writeBatch(db);

    ids.forEach((id) => {
      if (!id) return;
      batch.delete(chapterDocRef(id));
    });

    await batch.commit();
  }
}

export const chaptersService = new ChaptersService();

export default chaptersService;
