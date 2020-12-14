import { useEffect } from 'react';

export const useDebouncedEffect = (fn, deps, ms) => {
  useEffect(() => {
    const timeout = setTimeout(fn, ms);
    return () => {
      clearTimeout(timeout);
    };
  }, deps); // eslint-disable-line
};
