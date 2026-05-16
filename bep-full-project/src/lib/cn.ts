// bep-full-project/src/lib/cn.ts

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind + conditional class merge helper
 *
 * Usage:
 * cn(
 *   'rounded-xl p-4',
 *   isActive && 'bg-cyan-500',
 *   disabled ? 'opacity-50' : 'opacity-100',
 * )
 */
export function cn(
  ...inputs: ClassValue[]
): string {
  return twMerge(
    clsx(inputs),
  );
}

export default cn;
