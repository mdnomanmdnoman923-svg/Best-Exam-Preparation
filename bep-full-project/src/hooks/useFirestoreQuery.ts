import { useEffect, useState, useRef } from 'react'
import {
  db, collection, query, onSnapshot,
  type QueryConstraint,
} from '@/firebase/firestore'
import type { DocumentData } from 'firebase/firestore'

interface UseFirestoreQueryOptions {
  enabled?: boolean
}

export function useFirestoreQuery<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[],
  options: UseFirestoreQueryOptions = {}
) {
  const { enabled = true } = options
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const constraintsRef = useRef(constraints)

  useEffect(() => {
    if (!enabled) { setIsLoading(false); return }
    setIsLoading(true)
    const ref = collection(db, collectionName)
    const q = query(ref, ...constraintsRef.current)
    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T))
        setIsLoading(false)
      },
      (err) => { setError(err); setIsLoading(false) }
    )
    return unsub
  }, [collectionName, enabled])

  return { data, isLoading, error }
}
