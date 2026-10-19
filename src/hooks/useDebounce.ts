import { useState, useEffect } from 'react';

/**
 * Buổi 2 & Yêu cầu kỹ thuật 5: Custom hook generic useDebounce<T>
 * Trì hoãn việc cập nhật giá trị đầu ra cho tới khi delay ms trôi qua
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
