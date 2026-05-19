// bep-full-project/src/features/questions/services/questions.service.ts

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

export type QuestionType = 'mcq' | 'sq' | 'cq';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type QuestionStatus = 'draft' | 'published' | 'archived';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  isCorrect?: boolean;
}

export interface QuestionDocument {
  id?: string;
  subjectId: string;
  chapterId?: string;
  chapterName?: string;
  title?: string;
  question: string;
  explanation?: string;
  hint?: string;
  type: QuestionType;
  difficulty?: QuestionDifficulty;
  status?: QuestionStatus;
  order: number;
  points?: number;
  premium?: boolean;
  locked?: boolean;
  featured?: boolean;
  imageUrl?: string;
  tags?: string[];
  options?: QuestionOption[];
  correctAnswer?: string;
  answerKey?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface CreateQuestionInput {
  subjectId: string;
  chapterId?: string;
  chapterName?: string;
  title?: string;
  question: string;
  explanation?: string;
  hint?: string;
  type?: QuestionType;
  difficulty?: QuestionDifficulty;
  status?: QuestionStatus;
  order?: number;
  points?: number;
  premium?: boolean;
  locked?: boolean;
  featured?: boolean;
  imageUrl?: string;
  tags?: string[];
  options?: QuestionOption[];
  correctAnswer?: string;
  answerKey?: string;
  createdBy?: string;
}

export interface UpdateQuestionInput extends Partial<CreateQuestionInput> {
  type?: QuestionType;
}

const QUESTION_COLLECTION =
  (collectionNames as Record<string, string>).questions ||
  (collectionNames as Record<string, string>).questionBank ||
  'questions';

function normalizeSlugLikeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u0980-\u09FF]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeQuestionInput(
  input: CreateQuestionInput | UpdateQuestionInput,
): Omit<QuestionDocument, 'id' | 'createdAt' | 'updatedAt'> {
  const question = input.question?.trim() || '';
  const title = input.title?.trim() || question.slice(0, 90);

  const options = Array.isArray(input.options)
    ? input.options
        .filter((option) => Boolean(option && (option.value || option.label)))
        .map((option, index) => ({
          id: option.id?.trim() || `${index + 1}`,
          label: option.label?.trim() || String.fromCharCode(65 + index),
          value: option.value?.trim() || '',
          isCorrect: Boolean(option.isCorrect),
        }))
    : [];

  const questionType: QuestionType = input.type || (options.length > 0 ? 'mcq' : 'sq');

  const normalized: Omit<QuestionDocument, 'id' | 'createdAt' | 'updatedAt'> = {
    subjectId: input.subjectId?.trim?.() || '',
    chapterId: input.chapterId?.trim?.() || '',
    chapterName: input.chapterName?.trim?.() || '',
    title,
    question,
    explanation: input.explanation?.trim() || '',
    hint: input.hint?.trim() || '',
    type: questionType,
    difficulty: input.difficulty || 'medium',
    status: input.status || 'draft',
    order: typeof input.order === 'number' ? input.order : 0,
    points: typeof input.points === 'number' ? input.points : 1,
    premium: Boolean(input.premium),
    locked: Boolean(input.locked),
    featured: Boolean(input.featured),
    imageUrl: input.imageUrl?.trim() || '',
    tags: input.tags || [],
    options,
    correctAnswer: input.correctAnswer?.trim() || '',
    answerKey: input.answerKey?.trim() || '',
    createdBy: input.createdBy?.trim() || '',
    updatedBy: '',
  };

  if (normalized.type !== 'mcq') {
    normalized.options = [];
  }

  return normalized;
}

function questionCollectionRef() {
  return collection(db, QUESTION_COLLECTION);
}

function questionDocRef(id: string) {
  return doc(db, QUESTION_COLLECTION, id);
}

function safeString(value: unknown, fallback = ''): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  return fallback;
}

export class QuestionsService {
  static async createQuestion(
    input: CreateQuestionInput,
    customId?: string,
  ): Promise<string> {
    const payload = normalizeQuestionInput(input);

    if (!payload.subjectId) {
      throw new Error('subjectId is required');
    }

    if (!payload.question) {
      throw new Error('question is required');
    }

    if (customId) {
      await setDoc(questionDocRef(customId), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return customId;
    }

    const ref = await addDoc(questionCollectionRef(), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  }

  static async updateQuestion(
    id: string,
    input: UpdateQuestionInput,
  ): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    const ref = questionDocRef(id);
    const payload = normalizeQuestionInput(input);

    await updateDoc(ref, {
      ...payload,
      updatedAt: serverTimestamp(),
    });
  }

  static async deleteQuestion(id: string): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    await deleteDoc(questionDocRef(id));
  }

  static async getQuestionById(
    id: string,
  ): Promise<QuestionDocument | null> {
    if (!id) return null;

    const snapshot = await getDoc(questionDocRef(id));

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...(snapshot.data() as QuestionDocument),
    };
  }

  static async listQuestions(
    constraints: QueryConstraint[] = [],
  ): Promise<QuestionDocument[]> {
    const q = query(questionCollectionRef(), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...(item.data() as QuestionDocument),
    }));
  }

  static async listBySubject(
    subjectId: string,
    extraConstraints: QueryConstraint[] = [],
  ): Promise<QuestionDocument[]> {
    if (!subjectId) return [];

    return this.listQuestions([
      where('subjectId', '==', subjectId),
      orderBy('order', 'asc'),
      ...extraConstraints,
    ]);
  }

  static async listByChapter(
    chapterId: string,
    extraConstraints: QueryConstraint[] = [],
  ): Promise<QuestionDocument[]> {
    if (!chapterId) return [];

    return this.listQuestions([
      where('chapterId', '==', chapterId),
      orderBy('order', 'asc'),
      ...extraConstraints,
    ]);
  }

  static async listPublishedQuestions(
    take = 20,
  ): Promise<QuestionDocument[]> {
    return this.listQuestions([
      where('status', '==', 'published'),
      orderBy('order', 'asc'),
      limit(take),
    ]);
  }

  static async listFeaturedQuestions(
    take = 10,
  ): Promise<QuestionDocument[]> {
    return this.listQuestions([
      where('featured', '==', true),
      where('status', '==', 'published'),
      orderBy('order', 'asc'),
      limit(take),
    ]);
  }

  static subscribeQuestions(
    callback: (questions: QuestionDocument[]) => void,
    constraints: QueryConstraint[] = [],
  ) {
    const q = query(questionCollectionRef(), ...constraints);

    return onSnapshot(q, (snapshot) => {
      const questions = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as QuestionDocument),
      }));

      callback(questions);
    });
  }

  static subscribeQuestion(
    id: string,
    callback: (question: QuestionDocument | null) => void,
  ) {
    const ref = questionDocRef(id);

    return onSnapshot(ref, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback({
        id: snapshot.id,
        ...(snapshot.data() as QuestionDocument),
      });
    });
  }

  static async searchQuestions(
    searchTerm: string,
    take = 25,
  ): Promise<QuestionDocument[]> {
    const term = searchTerm.trim();
    if (!term) return [];

    const normalizedTerm = normalizeSlugLikeText(term);

    const snapshot = await getDocs(
      query(questionCollectionRef(), where('status', '==', 'published')),
    );

    const matched = snapshot.docs
      .map((item) => ({
        id: item.id,
        ...(item.data() as QuestionDocument),
      }))
      .filter((question) => {
        const haystack = [
          question.title,
          question.question,
          question.explanation,
          question.hint,
          question.chapterName,
          question.subjectId,
          ...(question.tags || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return (
          haystack.includes(term.toLowerCase()) ||
          normalizeSlugLikeText(haystack).includes(normalizedTerm)
        );
      })
      .slice(0, take);

    return matched;
  }

  static async reorderQuestions(
    orderedQuestionIds: string[],
  ): Promise<void> {
    if (!Array.isArray(orderedQuestionIds)) {
      throw new Error('orderedQuestionIds must be an array');
    }

    const batch = writeBatch(db);

    orderedQuestionIds.forEach((questionId, index) => {
      if (!questionId) return;
      const ref = questionDocRef(questionId);
      batch.update(ref, {
        order: index + 1,
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
  }

  static async setQuestionStatus(
    id: string,
    status: QuestionStatus,
  ): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    await updateDoc(questionDocRef(id), {
      status,
      updatedAt: serverTimestamp(),
    });
  }

  static async bulkDelete(ids: string[]): Promise<void> {
    if (!Array.isArray(ids) || ids.length === 0) return;

    const batch = writeBatch(db);

    ids.forEach((id) => {
      if (!id) return;
      batch.delete(questionDocRef(id));
    });

    await batch.commit();
  }

  static async bulkPublish(ids: string[]): Promise<void> {
    if (!Array.isArray(ids) || ids.length === 0) return;

    const batch = writeBatch(db);

    ids.forEach((id) => {
      if (!id) return;
      batch.update(questionDocRef(id), {
        status: 'published',
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
  }

  static async bulkArchive(ids: string[]): Promise<void> {
    if (!Array.isArray(ids) || ids.length === 0) return;

    const batch = writeBatch(db);

    ids.forEach((id) => {
      if (!id) return;
      batch.update(questionDocRef(id), {
        status: 'archived',
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
  }

  static async incrementQuestionPoints(
    id: string,
    delta = 1,
  ): Promise<void> {
    if (!id) {
      throw new Error('id is required');
    }

    const ref = questionDocRef(id);

    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(ref);

      if (!snapshot.exists()) {
        throw new Error('Question not found');
      }

      const data = snapshot.data() as QuestionDocument;
      const points = Math.max(0, Number(data.points || 0) + delta);

      transaction.update(ref, {
        points,
        updatedAt: serverTimestamp(),
      });
    });
  }

  static extractCorrectAnswer(question: QuestionDocument): string {
    if (question.correctAnswer) return question.correctAnswer;
    if (question.answerKey) return question.answerKey;

    const correctOption = (question.options || []).find(
      (option) => option.isCorrect,
    );

    return correctOption?.value || '';
  }

  static isMcq(question: QuestionDocument): boolean {
    return question.type === 'mcq';
  }

  static isAnswerCorrect(
    question: QuestionDocument,
    answer: string,
  ): boolean {
    const expected = this.extractCorrectAnswer(question).trim();
    if (!expected) return false;

    const normalizedExpected = expected.toLowerCase().replace(/\s+/g, ' ');
    const normalizedAnswer = answer.trim().toLowerCase().replace(/\s+/g, ' ');

    return normalizedExpected === normalizedAnswer;
  }

  static normalizeForSearch(value: string): string {
    return normalizeSlugLikeText(value);
  }
}

export const questionsService = new QuestionsService();

export {
  normalizeQuestionInput,
  questionCollectionRef,
  questionDocRef,
};

export default questionsService;
