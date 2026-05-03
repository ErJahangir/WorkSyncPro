import {useEffect, useState} from 'react';
// @ts-ignore
import debounce from 'lodash.debounce';

/**
 * Custom hook to debounce a value using lodash.debounce
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const debouncedSet = debounce((val: T) => {
      setDebouncedValue(val);
    }, delay);

    debouncedSet(value);

    return () => {
      debouncedSet.cancel();
    };
  }, [value, delay]);

  return debouncedValue;
}
