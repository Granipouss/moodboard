import { useState, useEffect } from 'react';

export const useIsVisible = (ref: React.RefObject<HTMLElement>) => {
  const [isVisible, setIsVisible] = useState(false);
  const [observer] = useState(
    () =>
      new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting)),
  );

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return isVisible;
};
