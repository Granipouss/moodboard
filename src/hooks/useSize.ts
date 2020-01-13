import { RefObject, useState, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export type State = {
  readonly bottom: number;
  readonly height: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
};

export const useSize = (ref: RefObject<HTMLElement>): State => {
  const [rect, setRect] = useState<State>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  const [observer] = useState(
    () =>
      new ResizeObserver(entries => {
        const entry = entries[0];
        if (entry) {
          setRect(entry.contentRect);
        }
      }),
  );

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return rect;
};
