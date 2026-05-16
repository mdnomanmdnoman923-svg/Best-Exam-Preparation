// bep-full-project/src/hooks/useFirestoreQuery.ts

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type {
  QueryConstraint,
} from 'firebase/firestore';

import {
  listDocuments,
  queryDocuments,
  subscribeCollection,
  type FirestoreConverter,
  type PaginationResult,
} from '@/firebase/firestore';

export interface UseFirestoreQueryOptions<T> {
  path: string;

  constraints?: QueryConstraint[];

  converter?: FirestoreConverter<T>;

  enabled?: boolean;

  realtime?: boolean;

  take?: number;

  initialData?: T[];

  refetchOnMount?: boolean;

  onSuccess?: (
    data: T[],
  ) => void;

  onError?: (
    error: Error,
  ) => void;
}

export interface UseFirestoreQueryReturn<T> {
  data: T[];

  loading: boolean;

  error: Error | null;

  initialized: boolean;

  empty: boolean;

  refresh: () => Promise<void>;

  setData: React.Dispatch<
    React.SetStateAction<T[]>
  >;

  pagination: {
    hasMore: boolean;

    lastDocument: unknown | null;

    loadMore: () => Promise<void>;

    loadingMore: boolean;
  };
}

export default function useFirestoreQuery<
  T = Record<string, unknown>,
>(
  options: UseFirestoreQueryOptions<T>,
): UseFirestoreQueryReturn<T> {
  const {
    path,
    constraints = [],
    converter,
    enabled = true,
    realtime = false,
    take,
    initialData = [],
    refetchOnMount = true,
    onSuccess,
    onError,
  } = options;

  const [data, setData] =
    useState<T[]>(
      initialData,
    );

  const [loading, setLoading] =
    useState<boolean>(
      enabled &&
        refetchOnMount &&
        initialData.length === 0,
    );

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [initialized, setInitialized] =
    useState<boolean>(
      initialData.length > 0,
    );

  const [error, setError] =
    useState<Error | null>(
      null,
    );

  const [hasMore, setHasMore] =
    useState(false);

  const [lastDocument, setLastDocument] =
    useState<unknown | null>(
      null,
    );

  const mountedRef =
    useRef(true);

  const fetchDocuments =
    useCallback(
      async () => {
        if (!enabled) {
          return;
        }

        try {
          setLoading(true);
          setError(null);

          if (
            typeof take ===
            'number'
          ) {
            const result: PaginationResult<T> =
              await listDocuments<T>(
                path,
                {
                  constraints,
                  take,
                },
                converter,
              );

            if (
              !mountedRef.current
            ) {
              return;
            }

            setData(
              result.items,
            );

            setHasMore(
              result.hasMore,
            );

            setLastDocument(
              result.lastDocument,
            );

            onSuccess?.(
              result.items,
            );
          } else {
            const result =
              await queryDocuments<T>(
                path,
                constraints,
                converter,
              );

            if (
              !mountedRef.current
            ) {
              return;
            }

            setData(result);

            setHasMore(
              false,
            );

            setLastDocument(
              null,
            );

            onSuccess?.(
              result,
            );
          }

          setInitialized(
            true,
          );
        } catch (err) {
          if (
            !mountedRef.current
          ) {
            return;
          }

          const normalizedError =
            err instanceof Error
              ? err
              : new Error(
                  'Failed to fetch firestore documents.',
                );

          setError(
            normalizedError,
          );

          onError?.(
            normalizedError,
          );
        } finally {
          if (
            mountedRef.current
          ) {
            setLoading(
              false,
            );
          }
        }
      },
      [
        constraints,
        converter,
        enabled,
        onError,
        onSuccess,
        path,
        take,
      ],
    );

  const loadMore =
    useCallback(
      async () => {
        if (
          !enabled ||
          !hasMore ||
          loadingMore ||
          typeof take !==
            'number'
        ) {
          return;
        }

        try {
          setLoadingMore(
            true,
          );

          const result =
            await listDocuments<T>(
              path,
              {
                constraints,
                take,
                lastDocument:
                  lastDocument ||
                  undefined,
              },
              converter,
            );

          if (
            !mountedRef.current
          ) {
            return;
          }

          setData(
            (
              previous,
            ) => [
              ...previous,
              ...result.items,
            ],
          );

          setHasMore(
            result.hasMore,
          );

          setLastDocument(
            result.lastDocument,
          );
        } catch (err) {
          if (
            !mountedRef.current
          ) {
            return;
          }

          const normalizedError =
            err instanceof Error
              ? err
              : new Error(
                  'Failed to load more documents.',
                );

          setError(
            normalizedError,
          );

          onError?.(
            normalizedError,
          );
        } finally {
          if (
            mountedRef.current
          ) {
            setLoadingMore(
              false,
            );
          }
        }
      },
      [
        constraints,
        converter,
        enabled,
        hasMore,
        lastDocument,
        loadingMore,
        onError,
        path,
        take,
      ],
    );

  useEffect(() => {
    mountedRef.current =
      true;

    return () => {
      mountedRef.current =
        false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    if (realtime) {
      setLoading(true);

      const unsubscribe =
        subscribeCollection<T>(
          path,
          (
            documents,
          ) => {
            if (
              !mountedRef.current
            ) {
              return;
            }

            setData(
              documents,
            );

            setLoading(
              false,
            );

            setInitialized(
              true,
            );

            setError(
              null,
            );

            onSuccess?.(
              documents,
            );
          },
          constraints,
          converter,
        );

      return () => {
        unsubscribe();
      };
    }

    if (
      refetchOnMount
    ) {
      fetchDocuments();
    }
  }, [
    constraints,
    converter,
    enabled,
    fetchDocuments,
    onSuccess,
    path,
    realtime,
    refetchOnMount,
  ]);

  const refresh =
    useCallback(
      async () => {
        await fetchDocuments();
      },
      [fetchDocuments],
    );

  const empty = useMemo(
    () =>
      initialized &&
      data.length === 0,
    [
      data.length,
      initialized,
    ],
  );

  return {
    data,
    loading,
    error,
    initialized,
    empty,
    refresh,
    setData,
    pagination: {
      hasMore,
      lastDocument,
      loadMore,
      loadingMore,
    },
  };
}
