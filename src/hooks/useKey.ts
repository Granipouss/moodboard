import { useEffect } from 'react';

export const useKeys = (
  callback: (event: KeyboardEvent) => void,
  deps: unknown[] = [],
) =>
  useEffect(() => {
    window.addEventListener('keydown', callback, false);
    return () => window.removeEventListener('keydown', callback, false);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

export const useKey = (
  key: string,
  callback: () => void,
  deps: unknown[] = [],
) =>
  useKeys(event => {
    if (event.key === key) callback();
  }, deps);
