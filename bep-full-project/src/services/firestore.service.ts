// bep-full-project/src/services/firestore.service.ts

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  type FirestoreDataConverter,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type WithFieldValue,
} from 'firebase/firestore';

import { db } from '@/firebase/firestore';

export type FirestoreId = string;

export interface FirestoreDocument<T> {
  id: FirestoreId;
  data: T;
}

export interface ListOptions {
  limitCount?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  whereField?: string;
  whereOperator?:
    | '=='
    | '!='
    | '<'
    | '<='
    | '>'
    | '>='
    | 'array-contains'
    | 'array-contains-any'
    | 'in'
    | 'not-in';
  whereValue?: unknown;
}

function getCollectionRef<T = DocumentData>(path: string) {
  return collection(db, path) as CollectionReference<T>;
}

function getDocRef<T = DocumentData>(path: string, id: string) {
  return doc(db, path, id) as DocumentReference<T>;
}

function buildConstraints(options?: ListOptions): QueryConstraint[] {
  const constraints: QueryConstraint[] = [];

  if (options?.whereField && typeof options.whereOperator === 'string') {
    constraints.push(where(options.whereField, options.whereOperator, options.whereValue));
  }

  if (options?.orderByField) {
    constraints.push(orderBy(options.orderByField, options.orderDirection ?? 'desc'));
  }

  if (typeof options?.limitCount === 'number') {
    constraints.push(limit(options.limitCount));
  }

  return constraints;
}

function sanitizeData<T extends Record<string, unknown>>(data: T): T {
  const next = { ...data };

  for (const [key, value] of Object.entries(next)) {
    if (value === undefined) {
      delete next[key];
    }
  }

  return next;
}

export function withServerTimestamp<T extends Record<string, unknown>>(data: T): T & {
  createdAt?: unknown;
  updatedAt?: unknown;
} {
  return {
    ...sanitizeData(data),
    updatedAt: serverTimestamp(),
  };
}

export async function createDocument<T extends Record<string, unknown>>(
  path: string,
  data: T,
) {
  const ref = await addDoc(getCollectionRef(path), {
    ...sanitizeData(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

export async function setDocument<T extends Record<string, unknown>>(
  path: string,
  id: string,
  data: Partial<T>,
  merge = true,
) {
  await setDoc(
    getDocRef<T>(path, id),
    {
      ...sanitizeData(data),
      updatedAt: serverTimestamp(),
    } as WithFieldValue<T>,
    { merge },
  );
}

export async function updateDocument<T extends Record<string, unknown>>(
  path: string,
  id: string,
  data: Partial<T>,
) {
  await updateDoc(getDocRef<T>(path, id), {
    ...sanitizeData(data),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(path: string, id: string) {
  await deleteDoc(getDocRef(path, id));
}

export async function getDocument<T>(path: string, id: string) {
  const snapshot = await getDoc(getDocRef<T>(path, id));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    data: snapshot.data() as T,
  };
}

export async function listDocuments<T>(
  path: string,
  options?: ListOptions,
): Promise<Array<FirestoreDocument<T>>> {
  const constraints = buildConstraints(options);
  const q = query(getCollectionRef<T>(path), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    data: item.data() as T,
  }));
}

export async function listCollection<T>(path: string) {
  return listDocuments<T>(path);
}

export async function findDocuments<T>(
  path: string,
  field: string,
  operator:
    | '=='
    | '!='
    | '<'
    | '<='
    | '>'
    | '>='
    | 'array-contains'
    | 'array-contains-any'
    | 'in'
    | 'not-in',
  value: unknown,
  options?: Omit<ListOptions, 'whereField' | 'whereOperator' | 'whereValue'>,
) {
  return listDocuments<T>(path, {
    ...options,
    whereField: field,
    whereOperator: operator,
    whereValue: value,
  });
}

export async function countDocuments<T>(path: string, options?: ListOptions) {
  const docs = await listDocuments<T>(path, options);
  return docs.length;
}

export async function existsDocument(path: string, id: string) {
  const snapshot = await getDoc(getDocRef(path, id));
  return snapshot.exists();
}

export async function upsertDocument<T extends Record<string, unknown>>(
  path: string,
  id: string,
  data: Partial<T>,
) {
  const ref = getDocRef<T>(path, id);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    await updateDoc(ref, {
      ...sanitizeData(data),
      updatedAt: serverTimestamp(),
    });
    return 'updated' as const;
  }

  await setDoc(ref, {
    ...sanitizeData(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as WithFieldValue<T>);

  return 'created' as const;
}

export function createTypedConverter<T extends DocumentData>() {
  return {
    toFirestore(value: WithFieldValue<T>): DocumentData {
      return value;
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions,
    ): T {
      return snapshot.data(options) as T;
    },
  } satisfies FirestoreDataConverter<T>;
}

export function refFromPath<T = DocumentData>(path: string, id: string) {
  return getDocRef<T>(path, id);
}

export function collectionFromPath<T = DocumentData>(path: string) {
  return getCollectionRef<T>(path);
}

export function nowTimestamp() {
  return serverTimestamp();
}
