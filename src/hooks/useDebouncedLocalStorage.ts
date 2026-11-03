import { useCallback, useEffect, useRef, useState } from 'react';

interface Options<T> {
  delay?: number;
  serialize?: (value: T) => string;
  deserialize?: (raw: string) => T;
}

export function useDebouncedLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: Options<T>
): [T, (next: T) => void, boolean] {
  const delay = options?.delay ?? 500;
  const serialize = options?.serialize ?? String;
  const deserialize = options?.deserialize ?? ((raw: string) => raw as T);

  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === null) return initialValue;
      return deserialize(saved);
    } catch {
      return initialValue;
    }
  });

  const [saveFailed, setSaveFailed] = useState(false);
  // 只写入编辑后的内容，避免用默认模板覆盖读取失败的原始缓存。
  const pending = useRef<{ value: T } | null>(null);
  const timer = useRef<number>();

  const save = useCallback(() => {
    window.clearTimeout(timer.current);
    if (!pending.current) return;
    try {
      localStorage.setItem(key, serialize(pending.current.value));
      pending.current = null;
      setSaveFailed(false);
    } catch {
      setSaveFailed(true);
    }
  }, [key, serialize]);

  const update = useCallback(
    (next: T) => {
      pending.current = { value: next };
      setValue(next);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(save, delay);
    },
    [delay, save]
  );

  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'hidden') save();
    }
    window.addEventListener('pagehide', save);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('pagehide', save);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      save();
    };
  }, [save]);

  return [value, update, saveFailed];
}
