// bep-full-project/src/hooks/useDebounce.ts

import {
  useEffect,
  useRef,
  useState,
} from 'react';

export interface UseDebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export interface UseDebounceReturn<T> {
  debouncedValue: T;
  cancel: () => void;
  flush: () => void;
}

export default function useDebounce<T>(
  value: T,
  delay = 500,
  options: UseDebounceOptions = {},
): UseDebounceReturn<T> {
  const {
    leading = false,
    trailing = true,
    maxWait,
  } = options;

  const [debouncedValue, setDebouncedValue] =
    useState<T>(value);

  const timeoutRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const maxWaitTimeoutRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const lastInvokeTimeRef =
    useRef<number>(
      Date.now(),
    );

  const latestValueRef =
    useRef<T>(value);

  latestValueRef.current =
    value;

  const clearTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(
        timeoutRef.current,
      );

      timeoutRef.current =
        null;
    }

    if (
      maxWaitTimeoutRef.current
    ) {
      clearTimeout(
        maxWaitTimeoutRef.current,
      );

      maxWaitTimeoutRef.current =
        null;
    }
  };

  const invoke = () => {
    lastInvokeTimeRef.current =
      Date.now();

    setDebouncedValue(
      latestValueRef.current,
    );
  };

  const cancel = () => {
    clearTimers();
  };

  const flush = () => {
    clearTimers();
    invoke();
  };

  useEffect(() => {
    const now = Date.now();

    const timeSinceLastInvoke =
      now -
      lastInvokeTimeRef.current;

    if (
      leading &&
      !timeoutRef.current
    ) {
      invoke();
    }

    if (trailing) {
      timeoutRef.current =
        setTimeout(() => {
          invoke();
          clearTimers();
        }, delay);
    }

    if (
      typeof maxWait ===
        'number' &&
      maxWait > 0
    ) {
      const remainingTime =
        maxWait -
        timeSinceLastInvoke;

      if (
        remainingTime <= 0
      ) {
        flush();
      } else {
        maxWaitTimeoutRef.current =
          setTimeout(() => {
            flush();
          }, remainingTime);
      }
    }

    return () => {
      clearTimers();
    };
  }, [
    delay,
    flush,
    leading,
    maxWait,
    trailing,
    value,
  ]);

  return {
    debouncedValue,
    cancel,
    flush,
  };
}
