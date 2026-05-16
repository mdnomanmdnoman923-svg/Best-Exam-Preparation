// bep-full-project/src/features/subjects/services/subjects.service.ts

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
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

export type SubjectLevel =
  | 'school'
  | 'college'
  | 'university'
  | 'admission';

export type SubjectStatus =
  | 'active'
  | 'draft'
  | 'archived';

export interface SubjectDocument {
  id?: string;
  name: string;
  slug?: string;
  level?: SubjectLevel;
  description?: string;
  icon?: string;
  colorClass?: string;
  status?: SubjectStatus;
  order: number;
  premium?: boolean;
  featured?: boolean;
  trending?: boolean;
  locked?: boolean;
  totalChapters?: number;
  totalQuestions?: number;
  totalStudents?: number;
  averageScore?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  lastUpdatedAt?: unknown;
}

export interface CreateSubjectInput {
  name: string;
  slug?: string;
  level?: SubjectLevel;
  description?: string;
  icon?: string;
  colorClass?: string;
  status?: SubjectStatus;
  order?: number;
  premium?: boolean;
  featured?: boolean;
  trending?: boolean;
  locked?: boolean;
  totalChapters?: number;
  totalQuestions?: number;
  totalStudents?: number;
  averageScore?: number;
  createdBy?: string;
}

export interface UpdateSubjectInput extends Partial<CreateSubjectInput> {
  status?: SubjectStatus;
}

export interface SubjectStats {
  totalSubjects: number;
  activeSubjects: number;
  draftSubjects: number;
  archivedSubjects: number;
  premiumSubjects: number;
  featuredSubjects: number;
  trendingSubjects: number;
  lockedSubjects: number;
  totalChapters: number;
  totalQuestions: number;
  totalStudents: number;
  averageScore: number;
}

export interface SubjectSummary {
  subjectId: string;
  name: string;
  slug?: string;
  level?: SubjectLevel;
  questionCount: number;
  chapterCount: number;
  studentCount: number;
  averageScore: number;
}

export interface SubjectListOptions {
  level?: SubjectLevel;
  status?: SubjectStatus;
  premiumOnly?: boolean;
  featuredOnly?: boolean;
  trendingOnly?: boolean;
  lockedOnly?: boolean;
  take?: number;
}

const SUBJECT_COLLECTION =
  (collectionNames as Record<string, string>).subjects ||
  (collectionNames as Record<string, string>).subjectBank ||
  'subjects';

function subjectCollectionRef() {
  return collection(db, SUBJECT_COLLECTION);
}

function subjectDocRef(id: string) {
  return doc(db, SUBJECT_COLLECTION, id);
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u0980-\u09FF]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function safeNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeSubjectInput(
  input: CreateSubjectInput | UpdateSubjectInput,
): Omit<SubjectDocument, 'id' | 'createdAt' | 'updatedAt' | 'lastUpdatedAt'> {
  const name = input.name?.trim() || '';
  const slug = input.slug?.trim() || slugify(name);

  return {
    name,
    slug,
    level: input.level || 'school',
    description: input.description?.trim() || '',
    icon: input.icon?.trim() || '',
    colorClass: input.colorClass?.trim() || '',
    status: input.status || 'draft',
    order: typeof input.order === 'number' ? input.order : 0,
    premium: Boolean(input.premium),
    featured: Boolean(input.featured),
    trending: Boolean(input.trending),
    locked: Boolean(input.locked),
    totalChapters: safeNumber(input.totalChapters, 0),
    totalQuestions: safeNumber(input.totalQuestions, 0),
    totalStudents: safeNumber(input.totalStudents, 0),
    averageScore: safeNumber(input.averageScore, 0),
    createdBy: input.createdBy?.trim() || '',
    updatedBy: '',
  };
}

function normalizeSubjectDocument(
  id: string,
  data: Record<string, unknown>,
): SubjectDocument {
  return {
    id,
    name: String(data.name || ''),
    slug: String(data.slug || ''),
    level: (data.level as SubjectLevel) || 'school',
    description: String(data.description || ''),
    icon: String(data.icon || ''),
    colorClass: String(data.colorClass || ''),
    status: (data.status as SubjectStatus) || 'draft',
    order: safeNumber(data.order, 0),
    premium: Boolean(data.premium),
    featured: Boolean(data.featured),
    trending: Boolean(data.trending),
    locked: Boolean(data.locked),
    totalChapters: safeNumber(data.totalChapters, 0),
    totalQuestions: safeNumber(data.totalQuestions, 0),
    totalStudents: safeNumber(data.totalStudents, 0),
    averageScore: safeNumber(data.averageScore, 0),
    createdBy: String(data.createdBy || ''),
    updatedBy: String(data.updatedBy || ''),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    lastUpdatedAt: data.lastUpdatedAt,
  };
}

export class SubjectsService {
  static async createSubject(
    input: CreateSubjectInput,
    customId?: string,
  ): Promise<string> {
    const payload = normalizeSubjectInput(input);

    if (!payload.name) {
      throw new Error('name is required');
    }

    if (customId) {
      await setDoc(subjectDocRef(customId), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
      });

      return customId;
    }

    const ref = await addDoc(subjectCollectionRef(), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastUpdatedAt: serverTimestamp(),
    });

    return ref.id;
  }

  static async updateSubject(
    id: string,
    input: UpdateSubjectInput,
  ): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    const payload = normalizeSubjectInput(input);

    await updateDoc(subjectDocRef(id), {
      ...payload,
      updatedAt: serverTimestamp(),
      lastUpdatedAt: serverTimestamp(),
    });
  }

  static async deleteSubject(id: string): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    await deleteDoc(subjectDocRef(id));
  }

  static async getSubjectById(
    id: string,
  ): Promise<SubjectDocument | null> {
    if (!id) return null;

    const snapshot = await getDoc(subjectDocRef(id));

    if (!snapshot.exists()) return null;

    return normalizeSubjectDocument(snapshot.id, snapshot.data() as Record<string, unknown>);
  }

  static async listSubjects(
    options: SubjectListOptions = {},
  ): Promise<SubjectDocument[]> {
    const constraints: QueryConstraint[] = [];

    if (options.level) {
      constraints.push(where('level', '==', options.level));
    }

    if (options.status) {
      constraints.push(where('status', '==', options.status));
    }

    if (options.premiumOnly) {
      constraints.push(where('premium', '==', true));
    }

    if (options.featuredOnly) {
      constraints.push(where('featured', '==', true));
    }

    if (options.trendingOnly) {
      constraints.push(where('trending', '==', true));
    }

    if (options.lockedOnly) {
      constraints.push(where('locked', '==', true));
    }

    constraints.push(orderBy('order', 'asc'));

    if (typeof options.take === 'number' && options.take > 0) {
      constraints.push(limit(options.take));
    }

    const snapshot = await getDocs(query(subjectCollectionRef(), ...constraints));

    return snapshot.docs.map((item) =>
      normalizeSubjectDocument(item.id, item.data() as Record<string, unknown>),
    );
  }

  static async listActiveSubjects(
    take = 50,
  ): Promise<SubjectDocument[]> {
    return this.listSubjects({
      status: 'active',
      take,
    });
  }

  static async listFeaturedSubjects(
    take = 20,
  ): Promise<SubjectDocument[]> {
    return this.listSubjects({
      status: 'active',
      featuredOnly: true,
      take,
    });
  }

  static async listTrendingSubjects(
    take = 20,
  ): Promise<SubjectDocument[]> {
    return this.listSubjects({
      status: 'active',
      trendingOnly: true,
      take,
    });
  }

  static async listByLevel(
    level: SubjectLevel,
    take = 50,
  ): Promise<SubjectDocument[]> {
    return this.listSubjects({
      level,
      take,
    });
  }

  static async searchSubjects(
    searchTerm: string,
    take = 25,
  ): Promise<SubjectDocument[]> {
    const term = searchTerm.trim();
    if (!term) return [];

    const normalizedTerm = slugify(term);

    const snapshot = await getDocs(
      query(subjectCollectionRef(), orderBy('order', 'asc')),
    );

    const matched = snapshot.docs
      .map((item) =>
        normalizeSubjectDocument(item.id, item.data() as Record<string, unknown>),
      )
      .filter((subject) => {
        const haystack = [
          subject.name,
          subject.slug,
          subject.description,
          subject.level,
          subject.status,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return (
          haystack.includes(term.toLowerCase()) ||
          slugify(haystack).includes(normalizedTerm)
        );
      })
      .slice(0, take);

    return matched;
  }

  static subscribeSubjects(
    callback: (subjects: SubjectDocument[]) => void,
    constraints: QueryConstraint[] = [],
  ) {
    const q = query(subjectCollectionRef(), ...constraints);

    return onSnapshot(q, (snapshot) => {
      const subjects = snapshot.docs.map((item) =>
        normalizeSubjectDocument(item.id, item.data() as Record<string, unknown>),
      );

      callback(subjects);
    });
  }

  static subscribeSubject(
    id: string,
    callback: (subject: SubjectDocument | null) => void,
  ) {
    const ref = subjectDocRef(id);

    return onSnapshot(ref, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback(
        normalizeSubjectDocument(
          snapshot.id,
          snapshot.data() as Record<string, unknown>,
        ),
      );
    });
  }

  static async reorderSubjects(
    orderedSubjectIds: string[],
  ): Promise<void> {
    if (!Array.isArray(orderedSubjectIds)) {
      throw new Error('orderedSubjectIds must be an array');
    }

    const batch = writeBatch(db);

    orderedSubjectIds.forEach((subjectId, index) => {
      if (!subjectId) return;
      batch.update(subjectDocRef(subjectId), {
        order: index + 1,
        updatedAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
  }

  static async setSubjectStatus(
    id: string,
    status: SubjectStatus,
  ): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    await updateDoc(subjectDocRef(id), {
      status,
      updatedAt: serverTimestamp(),
      lastUpdatedAt: serverTimestamp(),
    });
  }

  static async toggleFeatured(
    id: string,
    featured: boolean,
  ): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    await updateDoc(subjectDocRef(id), {
      featured,
      updatedAt: serverTimestamp(),
      lastUpdatedAt: serverTimestamp(),
    });
  }

  static async toggleTrending(
    id: string,
    trending: boolean,
  ): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    await updateDoc(subjectDocRef(id), {
      trending,
      updatedAt: serverTimestamp(),
      lastUpdatedAt: serverTimestamp(),
    });
  }

  static async toggleLocked(
    id: string,
    locked: boolean,
  ): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    await updateDoc(subjectDocRef(id), {
      locked,
      updatedAt: serverTimestamp(),
      lastUpdatedAt: serverTimestamp(),
    });
  }

  static async incrementSubjectStats(
    id: string,
    payload: {
      totalChapters?: number;
      totalQuestions?: number;
      totalStudents?: number;
      averageScore?: number;
    },
  ): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    const ref = subjectDocRef(id);

    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(ref);

      if (!snapshot.exists()) {
        throw new Error('Subject not found');
      }

      const data = snapshot.data() as Record<string, unknown>;

      transaction.update(ref, {
        totalChapters:
          typeof payload.totalChapters === 'number'
            ? payload.totalChapters
            : safeNumber(data.totalChapters, 0),
        totalQuestions:
          typeof payload.totalQuestions === 'number'
            ? payload.totalQuestions
            : safeNumber(data.totalQuestions, 0),
        totalStudents:
          typeof payload.totalStudents === 'number'
            ? payload.totalStudents
            : safeNumber(data.totalStudents, 0),
        averageScore:
          typeof payload.averageScore === 'number'
            ? payload.averageScore
            : safeNumber(data.averageScore, 0),
        updatedAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
      });
    });
  }

  static async bulkDelete(ids: string[]): Promise<void> {
    if (!Array.isArray(ids) || ids.length === 0) return;

    const batch = writeBatch(db);

    ids.forEach((id) => {
      if (!id) return;
      batch.delete(subjectDocRef(id));
    });

    await batch.commit();
  }

  static async bulkPublish(ids: string[]): Promise<void> {
    if (!Array.isArray(ids) || ids.length === 0) return;

    const batch = writeBatch(db);

    ids.forEach((id) => {
      if (!id) return;
      batch.update(subjectDocRef(id), {
        status: 'active',
        updatedAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
  }

  static async bulkArchive(ids: string[]): Promise<void> {
    if (!Array.isArray(ids) || ids.length === 0) return;

    const batch = writeBatch(db);

    ids.forEach((id) => {
      if (!id) return;
      batch.update(subjectDocRef(id), {
        status: 'archived',
        updatedAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
  }

  static async getStats(): Promise<SubjectStats> {
    const subjects = await this.listSubjects({ take: 5000 });

    return subjects.reduce<SubjectStats>(
      (acc, subject) => {
        acc.totalSubjects += 1;
        acc.totalChapters += safeNumber(subject.totalChapters, 0);
        acc.totalQuestions += safeNumber(subject.totalQuestions, 0);
        acc.totalStudents += safeNumber(subject.totalStudents, 0);
        acc.averageScore += safeNumber(subject.averageScore, 0);

        if (subject.status === 'active') acc.activeSubjects += 1;
        if (subject.status === 'draft') acc.draftSubjects += 1;
        if (subject.status === 'archived') acc.archivedSubjects += 1;
        if (subject.premium) acc.premiumSubjects += 1;
        if (subject.featured) acc.featuredSubjects += 1;
        if (subject.trending) acc.trendingSubjects += 1;
        if (subject.locked) acc.lockedSubjects += 1;

        return acc;
      },
      {
        totalSubjects: 0,
        activeSubjects: 0,
        draftSubjects: 0,
        archivedSubjects: 0,
        premiumSubjects: 0,
        featuredSubjects: 0,
        trendingSubjects: 0,
        lockedSubjects: 0,
        totalChapters: 0,
        totalQuestions: 0,
        totalStudents: 0,
        averageScore: 0,
      },
    );
  }

  static async getSummaries(): Promise<SubjectSummary[]> {
    const subjects = await this.listSubjects({ take: 5000 });

    return subjects.map((subject) => ({
      subjectId: subject.id || '',
      name: subject.name,
      slug: subject.slug,
      level: subject.level,
      questionCount: safeNumber(subject.totalQuestions, 0),
      chapterCount: safeNumber(subject.totalChapters, 0),
      studentCount: safeNumber(subject.totalStudents, 0),
      averageScore: safeNumber(subject.averageScore, 0),
    }));
  }

  static async normalizeAndSave(
    id: string,
    input: UpdateSubjectInput,
  ): Promise<void> {
    await this.updateSubject(id, input);
  }

  static async incrementOrder(
    id: string,
    delta: number,
  ): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    const ref = subjectDocRef(id);

    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(ref);

      if (!snapshot.exists()) {
        throw new Error('Subject not found');
      }

      const data = snapshot.data() as Record<string, unknown>;
      const order = Math.max(0, safeNumber(data.order, 0) + delta);

      transaction.update(ref, {
        order,
        updatedAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
      });
    });
  }

  static normalizeSlug(value: string): string {
    return slugify(value);
  }
}

export const subjectsService = new SubjectsService();

export {
  normalizeSubjectInput,
  normalizeSubjectDocument,
  subjectCollectionRef,
  subjectDocRef,
};

export default subjectsService;
