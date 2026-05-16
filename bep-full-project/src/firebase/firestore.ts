// bep-full-project/src/firebase/firestore.ts

import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  runTransaction,
  serverTimestamp,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

import { db } from './config';

export interface FirestoreListOptions {
  constraints?: QueryConstraint[];

  take?: number;

  lastDocument?: unknown;
}

export interface PaginationResult<T> {
  items: T[];

  lastDocument: unknown | null;

  hasMore: boolean;
}

export interface FirestoreTimestampFields {
  createdAt?: unknown;

  updatedAt?: unknown;
}

export interface BaseDocument
  extends FirestoreTimestampFields {
  id?: string;
}

export type FirestoreConverter<T> = (
  data: Record<string, unknown>,
  id: string,
) => T;

export function getCollection<T = DocumentData>(
  path: string,
) {
  return collection(
    db,
    path,
  ) as CollectionReference<T>;
}

export function getDocument<T = DocumentData>(
  path: string,
  id: string,
) {
  return doc(
    db,
    path,
    id,
  ) as DocumentReference<T>;
}

export async function createDocument<
  T extends Record<
    string,
    unknown
  >,
>(
  path: string,
  payload: T,
  customId?: string,
) {
  const normalizedPayload = {
    ...payload,
    createdAt:
      serverTimestamp(),
    updatedAt:
      serverTimestamp(),
  };

  if (customId) {
    const reference =
      getDocument(
        path,
        customId,
      );

    await setDoc(
      reference,
      normalizedPayload,
    );

    return customId;
  }

  const reference =
    await addDoc(
      getCollection(path),
      normalizedPayload,
    );

  return reference.id;
}

export async function updateDocument<
  T extends Record<
    string,
    unknown
  >,
>(
  path: string,
  id: string,
  payload: Partial<T>,
) {
  const reference =
    getDocument(path, id);

  await updateDoc(reference, {
    ...payload,
    updatedAt:
      serverTimestamp(),
  });
}

export async function deleteDocument(
  path: string,
  id: string,
) {
  const reference =
    getDocument(path, id);

  await deleteDoc(reference);
}

export async function getDocumentById<
  T = DocumentData,
>(
  path: string,
  id: string,
  converter?: FirestoreConverter<T>,
): Promise<T | null> {
  const reference =
    getDocument(path, id);

  const snapshot =
    await getDoc(reference);

  if (!snapshot.exists()) {
    return null;
  }

  const data =
    snapshot.data() as Record<
      string,
      unknown
    >;

  if (converter) {
    return converter(
      data,
      snapshot.id,
    );
  }

  return {
    id: snapshot.id,
    ...data,
  } as T;
}

export async function listDocuments<
  T = DocumentData,
>(
  path: string,
  options: FirestoreListOptions = {},
  converter?: FirestoreConverter<T>,
): Promise<
  PaginationResult<T>
> {
  const constraints: QueryConstraint[] =
    [];

  if (
    Array.isArray(
      options.constraints,
    )
  ) {
    constraints.push(
      ...options.constraints,
    );
  }

  if (
    typeof options.take ===
    'number'
  ) {
    constraints.push(
      limit(options.take),
    );
  }

  if (
    options.lastDocument
  ) {
    constraints.push(
      startAfter(
        options.lastDocument as never,
      ),
    );
  }

  const q = query(
    getCollection(path),
    ...constraints,
  );

  const snapshot =
    await getDocs(q);

  const items =
    snapshot.docs.map(
      (item) => {
        const data =
          item.data() as Record<
            string,
            unknown
          >;

        if (converter) {
          return converter(
            data,
            item.id,
          );
        }

        return {
          id: item.id,
          ...data,
        } as T;
      },
    );

  return {
    items,
    lastDocument:
      snapshot.docs.at(-1) ||
      null,
    hasMore:
      typeof options.take ===
      'number'
        ? snapshot.docs.length >=
          options.take
        : false,
  };
}

export async function queryDocuments<
  T = DocumentData,
>(
  path: string,
  constraints: QueryConstraint[],
  converter?: FirestoreConverter<T>,
) {
  const q = query(
    getCollection(path),
    ...constraints,
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (item) => {
      const data =
        item.data() as Record<
          string,
          unknown
        >;

      if (converter) {
        return converter(
          data,
          item.id,
        );
      }

      return {
        id: item.id,
        ...data,
      } as T;
    },
  );
}

export function subscribeDocument<
  T = DocumentData,
>(
  path: string,
  id: string,
  callback: (
    value: T | null,
  ) => void,
  converter?: FirestoreConverter<T>,
) {
  const reference =
    getDocument(path, id);

  return onSnapshot(
    reference,
    (snapshot) => {
      if (
        !snapshot.exists()
      ) {
        callback(null);
        return;
      }

      const data =
        snapshot.data() as Record<
          string,
          unknown
        >;

      if (converter) {
        callback(
          converter(
            data,
            snapshot.id,
          ),
        );

        return;
      }

      callback({
        id: snapshot.id,
        ...data,
      } as T);
    },
  );
}

export function subscribeCollection<
  T = DocumentData,
>(
  path: string,
  callback: (
    value: T[],
  ) => void,
  constraints: QueryConstraint[] = [],
  converter?: FirestoreConverter<T>,
) {
  const q = query(
    getCollection(path),
    ...constraints,
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items =
        snapshot.docs.map(
          (item) => {
            const data =
              item.data() as Record<
                string,
                unknown
              >;

            if (
              converter
            ) {
              return converter(
                data,
                item.id,
              );
            }

            return {
              id: item.id,
              ...data,
            } as T;
          },
        );

      callback(items);
    },
  );
}

export async function batchDelete(
  path: string,
  ids: string[],
) {
  if (
    !Array.isArray(ids) ||
    ids.length === 0
  ) {
    return;
  }

  const batch =
    writeBatch(db);

  ids.forEach((id) => {
    if (!id) return;

    batch.delete(
      getDocument(path, id),
    );
  });

  await batch.commit();
}

export async function batchUpdate<
  T extends Record<
    string,
    unknown
  >,
>(
  path: string,
  items: Array<{
    id: string;
    data: Partial<T>;
  }>,
) {
  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return;
  }

  const batch =
    writeBatch(db);

  items.forEach((item) => {
    if (!item.id) return;

    batch.update(
      getDocument(
        path,
        item.id,
      ),
      {
        ...item.data,
        updatedAt:
          serverTimestamp(),
      },
    );
  });

  await batch.commit();
}

export async function incrementField(
  path: string,
  id: string,
  field: string,
  value = 1,
) {
  const reference =
    getDocument(path, id);

  await updateDoc(reference, {
    [field]: increment(value),
    updatedAt:
      serverTimestamp(),
  });
}

export async function runSafeTransaction<
  T,
>(
  handler: (
    transaction: Parameters<
      typeof runTransaction
    >[1] extends (
      transaction: infer R,
    ) => Promise<unknown>
      ? R
      : never,
  ) => Promise<T>,
) {
  return runTransaction(
    db,
    async (
      transaction,
    ) => {
      return handler(
        transaction,
      );
    },
  );
}

export function buildTimestamp() {
  return serverTimestamp();
}

export function buildNowTimestamp() {
  return Timestamp.now();
}

export function buildQueryConstraints(
  payload: {
    whereEquals?: Array<{
      field: string;
      value: unknown;
    }>;

    orderByField?: {
      field: string;
      direction?:
        | 'asc'
        | 'desc';
    };

    take?: number;
  },
) {
  const constraints: QueryConstraint[] =
    [];

  payload.whereEquals?.forEach(
    (item) => {
      constraints.push(
        where(
          item.field,
          '==',
          item.value,
        ),
      );
    },
  );

  if (
    payload.orderByField
  ) {
    constraints.push(
      orderBy(
        payload
          .orderByField.field,
        payload
          .orderByField
          .direction ||
          'asc',
      ),
    );
  }

  if (
    typeof payload.take ===
    'number'
  ) {
    constraints.push(
      limit(payload.take),
    );
  }

  return constraints;
}

export default {
  db,
  getCollection,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  queryDocuments,
  subscribeDocument,
  subscribeCollection,
  batchDelete,
  batchUpdate,
  incrementField,
  runSafeTransaction,
  buildTimestamp,
  buildNowTimestamp,
  buildQueryConstraints,
};
