// bep-full-project/src/lib/helpers.ts

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(
  ...inputs: ClassValue[]
): string {
  return twMerge(
    clsx(inputs),
  );
}

export function sleep(
  ms = 300,
): Promise<void> {
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        ms,
      );
    },
  );
}

export function randomId(
  prefix = 'id',
): string {
  return `${prefix}_${Math.random()
    .toString(36)
    .slice(2, 10)}_${Date.now()}`;
}

export function slugify(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(
      /[^a-z0-9\u0980-\u09FF]+/gi,
      '-',
    )
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function capitalize(
  value?: string | null,
): string {
  if (!value) {
    return '';
  }

  return (
    value.charAt(0)
      .toUpperCase() +
    value.slice(1)
  );
}

export function capitalizeWords(
  value?: string | null,
): string {
  if (!value) {
    return '';
  }

  return value
    .trim()
    .split(/\s+/)
    .map((part) =>
      capitalize(part),
    )
    .join(' ');
}

export function truncateText(
  value: string,
  maxLength = 120,
  suffix = '...',
): string {
  if (
    !value ||
    value.length <=
      maxLength
  ) {
    return value;
  }

  return `${value.slice(
    0,
    maxLength,
  )}${suffix}`;
}

export function safeJsonParse<T>(
  value: string,
  fallback: T,
): T {
  try {
    return JSON.parse(
      value,
    ) as T;
  } catch {
    return fallback;
  }
}

export function safeJsonStringify(
  value: unknown,
  fallback = '',
): string {
  try {
    return JSON.stringify(
      value,
    );
  } catch {
    return fallback;
  }
}

export function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(
    Math.max(value, min),
    max,
  );
}

export function percentage(
  current: number,
  total: number,
  precision = 0,
): number {
  if (total <= 0) {
    return 0;
  }

  return Number(
    (
      (current / total) *
      100
    ).toFixed(precision),
  );
}

export function average(
  values: number[],
): number {
  if (
    !Array.isArray(values) ||
    values.length === 0
  ) {
    return 0;
  }

  const total =
    values.reduce(
      (sum, item) =>
        sum + item,
      0,
    );

  return total /
    values.length;
}

export function sum(
  values: number[],
): number {
  return values.reduce(
    (total, value) =>
      total + value,
    0,
  );
}

export function uniqueArray<T>(
  values: T[],
): T[] {
  return [
    ...new Set(values),
  ];
}

export function chunkArray<T>(
  values: T[],
  size = 10,
): T[][] {
  const result: T[][] =
    [];

  for (
    let i = 0;
    i < values.length;
    i += size
  ) {
    result.push(
      values.slice(
        i,
        i + size,
      ),
    );
  }

  return result;
}

export function groupBy<
  T extends Record<
    string,
    unknown
  >,
>(
  values: T[],
  key: keyof T,
) {
  return values.reduce<
    Record<string, T[]>
  >((acc, item) => {
    const group =
      String(item[key]);

    if (!acc[group]) {
      acc[group] = [];
    }

    acc[group].push(
      item,
    );

    return acc;
  }, {});
}

export function sortBy<
  T extends Record<
    string,
    unknown
  >,
>(
  values: T[],
  key: keyof T,
  direction:
    | 'asc'
    | 'desc' = 'asc',
): T[] {
  return [...values].sort(
    (a, b) => {
      const aValue =
        a[key];
      const bValue =
        b[key];

      if (
        aValue === bValue
      ) {
        return 0;
      }

      if (
        direction ===
        'asc'
      ) {
        return aValue >
          bValue
          ? 1
          : -1;
      }

      return aValue <
        bValue
        ? 1
        : -1;
    },
  );
}

export function generateInitials(
  value?: string | null,
): string {
  if (!value) {
    return 'NA';
  }

  const parts =
    value
      .trim()
      .split(/\s+/);

  if (
    parts.length === 1
  ) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0] || ''}${
    parts[1][0] || ''
  }`.toUpperCase();
}

export function isBrowser() {
  return (
    typeof window !==
    'undefined'
  );
}

export function isTouchDevice() {
  if (!isBrowser()) {
    return false;
  }

  return (
    'ontouchstart' in
      window ||
    navigator.maxTouchPoints >
      0
  );
}

export function copyToClipboard(
  value: string,
) {
  if (
    !navigator.clipboard
  ) {
    return Promise.reject(
      new Error(
        'Clipboard API not supported.',
      ),
    );
  }

  return navigator.clipboard.writeText(
    value,
  );
}

export function downloadFile(
  url: string,
  filename?: string,
) {
  if (!isBrowser()) {
    return;
  }

  const link =
    document.createElement(
      'a',
    );

  link.href = url;

  if (filename) {
    link.download =
      filename;
  }

  document.body.appendChild(
    link,
  );

  link.click();

  document.body.removeChild(
    link,
  );
}

export function debounce<
  T extends (
    ...args: never[]
  ) => void,
>(
  callback: T,
  delay = 300,
) {
  let timeout:
    | ReturnType<
        typeof setTimeout
      >
    | null = null;

  return (
    ...args: Parameters<T>
  ) => {
    if (timeout) {
      clearTimeout(
        timeout,
      );
    }

    timeout = setTimeout(
      () => {
        callback(
          ...args,
        );
      },
      delay,
    );
  };
}

export function throttle<
  T extends (
    ...args: never[]
  ) => void,
>(
  callback: T,
  delay = 300,
) {
  let lastCall = 0;

  return (
    ...args: Parameters<T>
  ) => {
    const now =
      Date.now();

    if (
      now - lastCall >=
      delay
    ) {
      lastCall = now;

      callback(
        ...args,
      );
    }
  };
}

export function formatBytes(
  bytes: number,
): string {
  if (
    !Number.isFinite(bytes) ||
    bytes <= 0
  ) {
    return '0 B';
  }

  const units = [
    'B',
    'KB',
    'MB',
    'GB',
    'TB',
  ];

  let size = bytes;
  let index = 0;

  while (
    size >= 1024 &&
    index <
      units.length - 1
  ) {
    size /= 1024;
    index += 1;
  }

  return `${size.toFixed(
    size >= 10 ? 0 : 1,
  )} ${units[index]}`;
}

export function getRandomItem<T>(
  values: T[],
): T | undefined {
  if (
    !Array.isArray(values) ||
    values.length === 0
  ) {
    return undefined;
  }

  return values[
    Math.floor(
      Math.random() *
        values.length,
    )
  ];
}

export function shuffleArray<T>(
  values: T[],
): T[] {
  const cloned =
    [...values];

  for (
    let i =
      cloned.length - 1;
    i > 0;
    i -= 1
  ) {
    const j =
      Math.floor(
        Math.random() *
          (i + 1),
      );

    [cloned[i], cloned[j]] =
      [
        cloned[j],
        cloned[i],
      ];
  }

  return cloned;
}

export default {
  cn,
  sleep,
  randomId,
  slugify,
  capitalize,
  capitalizeWords,
  truncateText,
  safeJsonParse,
  safeJsonStringify,
  clamp,
  percentage,
  average,
  sum,
  uniqueArray,
  chunkArray,
  groupBy,
  sortBy,
  generateInitials,
  isBrowser,
  isTouchDevice,
  copyToClipboard,
  downloadFile,
  debounce,
  throttle,
  formatBytes,
  getRandomItem,
  shuffleArray,
};
