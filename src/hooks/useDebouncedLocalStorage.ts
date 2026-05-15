import { useEffect, useRef, useState } from 'react';

interface Options<T> {
  delay?: number;
  serialize?: (value: T) => string;
  deserialize?: (raw: string) => T;
}

const defaultStringOptions: Required<Options<string>> = {
  delay: 500,
  serialize: (v) => v,
  deserialize: (s) => s,
};

export function useDebouncedLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: Options<T>
): [T, (next: T) => void] {
  const delay = options?.delay ?? 500;
  const serialize =
    options?.serialize ?? ((defaultStringOptions.serialize as unknown) as (v: T) => string);
  const deserialize =
    options?.deserialize ??
    ((defaultStringOptions.deserialize as unknown) as (raw: string) => T);

  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === null) return initialValue;
      return deserialize(saved);
    } catch {
      return initialValue;
    }
  });

  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(key, serialize(value));
      } catch {
        // 配额超出或隐私模式下静默失败
      }
    }, delay);
    return () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
    };
  }, [key, value, delay, serialize]);

  return [value, setValue];
}
