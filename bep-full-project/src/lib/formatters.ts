import { format, formatDistanceToNow } from 'date-fns'
import { toBengaliNumber } from './helpers'
import type { Timestamp } from 'firebase/firestore'

export function formatDate(ts: Timestamp | Date | null | undefined): string {
  if (!ts) return '—'
  const date = ts instanceof Date ? ts : ts.toDate()
  return format(date, 'dd MMM yyyy')
}

export function formatRelative(ts: Timestamp | Date | null | undefined): string {
  if (!ts) return '—'
  const date = ts instanceof Date ? ts : ts.toDate()
  return formatDistanceToNow(date, { addSuffix: true })
}

export function formatPercentage(value: number): string {
  return `${toBengaliNumber(Math.round(value))}%`
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${toBengaliNumber(Math.floor(n / 100_000) / 10)}M`
  if (n >= 1_000) return `${toBengaliNumber(Math.floor(n / 100) / 10)}K`
  return toBengaliNumber(n)
}
