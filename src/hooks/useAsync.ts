import { useState, useEffect, useRef } from 'react';

import { useIsMounted } from './useIsMounted';

export type AsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      value?: undefined;
      done: false;
    }
  | {
      loading: false;
      error: unknown;
      value?: undefined;
      done: true;
    }
  | {
      loading: false;
      error?: undefined;
      value: T;
      done: true;
    };

export const useAsync = <T>(fn: () => Promise<T>, deps: unknown[] = []) => {
  const [state, setState] = useState<AsyncState<T>>({
    loading: true,
    done: false,
  });

  const isMounted = useIsMounted();
  const lastCallId = useRef(0);

  useEffect(() => {
    const callId = ++lastCallId.current;
    setState({ loading: true, done: false });
    fn().then(
      value => {
        if (isMounted() && callId === lastCallId.current) {
          setState({ value, loading: false, done: true });
        }
      },
      error => {
        if (isMounted() && callId === lastCallId.current) {
          setState({ error, loading: false, done: true });
        }
      },
    );
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return [state.value, state] as const;
};
