// bep-full-project/src/lib/formatters.ts

import {
  format,
  formatDistanceToNow,
  isValid,
  parseISO,
} from 'date-fns';

import { bn } from 'date-fns/locale';

import {
  DATE_FORMATS,
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
} from './constants';

type DateInput =
  | string
  | number
  | Date
  | null
  | undefined;

function toDate(
  value: DateInput,
): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return isValid(value)
      ? value
      : null;
  }

  if (
    typeof value ===
      'string' &&
    value.trim()
  ) {
    const parsed =
      parseISO(value);

    if (isValid(parsed)) {
      return parsed;
    }
  }

  const fallback =
    new Date(value);

  return isValid(fallback)
    ? fallback
    : null;
}

export function formatDate(
  value: DateInput,
  pattern: string =
    DATE_FORMATS.short,
  locale = bn,
): string {
  const date =
    toDate(value);

  if (!date) {
    return '--';
  }

  return format(
    date,
    pattern,
    {
      locale,
    },
  );
}

export function formatShortDate(
  value: DateInput,
) {
  return formatDate(
    value,
    DATE_FORMATS.short,
  );
}

export function formatLongDate(
  value: DateInput,
) {
  return formatDate(
    value,
    DATE_FORMATS.long,
  );
}

export function formatTime(
  value: DateInput,
) {
  return formatDate(
    value,
    DATE_FORMATS.time,
  );
}

export function formatFullDate(
  value: DateInput,
) {
  return formatDate(
    value,
    DATE_FORMATS.full,
  );
}

export function formatRelativeDate(
  value: DateInput,
  addSuffix = true,
) {
  const date =
    toDate(value);

  if (!date) {
    return '--';
  }

  return formatDistanceToNow(
    date,
    {
      addSuffix,
      locale: bn,
    },
  );
}

export function formatNumber(
  value: number,
  locale =
    DEFAULT_LANGUAGE ===
    'bn'
      ? 'bn-BD'
      : 'en-US',
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(
    locale,
    options,
  ).format(
    Number.isFinite(value)
      ? value
      : 0,
  );
}

export function formatCompactNumber(
  value: number,
  locale =
    DEFAULT_LANGUAGE ===
    'bn'
      ? 'bn-BD'
      : 'en-US',
) {
  return new Intl.NumberFormat(
    locale,
    {
      notation:
        'compact',
      maximumFractionDigits: 1,
    },
  ).format(
    Number.isFinite(value)
      ? value
      : 0,
  );
}

export function formatCurrency(
  amount: number,
  currency =
    DEFAULT_CURRENCY,
  locale =
    DEFAULT_LANGUAGE ===
    'bn'
      ? 'bn-BD'
      : 'en-US',
) {
  return new Intl.NumberFormat(
    locale,
    {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    },
  ).format(
    Number.isFinite(amount)
      ? amount
      : 0,
  );
}

export function formatPercentage(
  value: number,
  maximumFractionDigits = 0,
) {
  return `${formatNumber(
    value,
    'en-US',
    {
      maximumFractionDigits,
    },
  )}%`;
}

export function formatScore(
  value: number,
  total?: number,
) {
  if (
    typeof total ===
      'number' &&
    total > 0
  ) {
    return `${formatNumber(
      value,
    )}/${formatNumber(
      total,
    )}`;
  }

  return formatNumber(
    value,
  );
}

export function formatDuration(
  totalSeconds: number,
) {
  const safeSeconds =
    Math.max(
      0,
      Math.floor(
        totalSeconds,
      ),
    );

  const hours =
    Math.floor(
      safeSeconds / 3600,
    );

  const minutes =
    Math.floor(
      (safeSeconds %
        3600) /
        60,
    );

  const seconds =
    safeSeconds % 60;

  const parts: string[] =
    [];

  if (hours > 0) {
    parts.push(
      `${hours}h`,
    );
  }

  if (
    minutes > 0 ||
    hours > 0
  ) {
    parts.push(
      `${minutes}m`,
    );
  }

  parts.push(
    `${seconds}s`,
  );

  return parts.join(' ');
}

export function formatReadingTime(
  minutes: number,
) {
  if (minutes <= 0) {
    return '0 min';
  }

  if (minutes < 60) {
    return `${formatNumber(
      minutes,
    )} min`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  const remainingMinutes =
    minutes % 60;

  if (
    remainingMinutes === 0
  ) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

export function formatPhoneNumber(
  value?: string | null,
) {
  if (!value) {
    return '--';
  }

  const cleaned =
    value.replace(
      /\D/g,
      '',
    );

  if (
    cleaned.startsWith(
      '880',
    )
  ) {
    return `+${cleaned}`;
  }

  if (
    cleaned.startsWith(
      '01',
    )
  ) {
    return `+88${cleaned}`;
  }

  return value;
}

export function truncateText(
  value: string,
  maxLength = 120,
  suffix = '...',
) {
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

export function capitalize(
  value?: string | null,
) {
  if (!value) {
    return '';
  }

  return (
    value.charAt(0)
      .toUpperCase() +
    value.slice(1)
  );
}

export function formatName(
  value?: string | null,
) {
  if (!value) {
    return 'Unknown';
  }

  return value
    .trim()
    .split(/\s+/)
    .map((part) =>
      capitalize(part),
    )
    .join(' ');
}

export function formatInitials(
  value?: string | null,
) {
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

export function formatFileSize(
  bytes: number,
) {
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
  let unitIndex = 0;

  while (
    size >= 1024 &&
    unitIndex <
      units.length - 1
  ) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(
    size >= 10 ? 0 : 1,
  )} ${
    units[unitIndex]
  }`;
}

export function formatExamTime(
  minutes: number,
) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  const remaining =
    minutes % 60;

  if (remaining === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remaining} min`;
}

export function formatAccuracy(
  correct: number,
  total: number,
) {
  if (total <= 0) {
    return '0%';
  }

  const percentage =
    (correct / total) *
    100;

  return formatPercentage(
    percentage,
    1,
  );
}

export function formatRank(
  rank: number,
) {
  const suffix =
    rank % 10 === 1 &&
    rank % 100 !== 11
      ? 'st'
      : rank % 10 === 2 &&
          rank % 100 !==
            12
        ? 'nd'
        : rank % 10 === 3 &&
            rank % 100 !==
              13
          ? 'rd'
          : 'th';

  return `${formatNumber(
    rank,
  )}${suffix}`;
}

export default {
  formatDate,
  formatShortDate,
  formatLongDate,
  formatTime,
  formatFullDate,
  formatRelativeDate,
  formatNumber,
  formatCompactNumber,
  formatCurrency,
  formatPercentage,
  formatScore,
  formatDuration,
  formatReadingTime,
  formatPhoneNumber,
  truncateText,
  capitalize,
  formatName,
  formatInitials,
  formatFileSize,
  formatExamTime,
  formatAccuracy,
  formatRank,
};
