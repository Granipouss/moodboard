import { useEffect, useState } from 'react';

import { useKeys } from '../../hooks/useKey';
import { useIsMounted } from '../../hooks/useIsMounted';

export const useScrollControl = (
  cursor: number,
  width: number,
  targetRefs: React.MutableRefObject<(HTMLElement | null)[]>,
) => {
  // Disable arrow scroll
  useKeys(event => {
    if (event.key.match(/^arrow/i) != null) {
      event.preventDefault();
    }
  });

  const isMounted = useIsMounted();

  const [behavior, setBehavior] = useState<'auto' | 'smooth'>('auto');
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isMounted()) setBehavior('smooth');
    }, 1e3);
    return () => clearTimeout(timeout);
  }, [isMounted]);

  useEffect(() => {
    // Do nothing if no DOM element
    const tile = targetRefs.current[cursor];
    if (!tile) return;

    // Scroll to element
    tile.scrollIntoView({ behavior, block: 'center' });
    // firstScrollRef.current = false;
  }, [cursor, behavior, targetRefs, width]);
};
