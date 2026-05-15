import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'resumemd:content';

export function useDebouncedLocalStorage(
  initialValue: string,
  delay = 500
): [string, (next: string) => void] {
  const [value, setValue] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ?? initialValue;
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
        localStorage.setItem(STORAGE_KEY, value);
      } catch {
        // 容量超限或隐私模式下静默失败
      }
    }, delay);
    return () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
    };
  }, [value, delay]);

  return [value, setValue];
}

export function clearStoredContent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 忽略
  }
}
