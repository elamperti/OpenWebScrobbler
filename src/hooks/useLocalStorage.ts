import { useState, useEffect } from 'react';

const useLocalStorage = <T>(key: string, defaultValue?: T) => {
  const [value, setValue] = useState<T | undefined>(() => {
    let storedValue;

    try {
      storedValue = localStorage.getItem(key);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Error reading key «${key}» from localStorage`, error);
    }

    return storedValue ? JSON.parse(storedValue) : defaultValue;
  });

  useEffect(() => {
    if (value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`Error saving key «${key}» to localStorage:`, error);
      }
    } else {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`Error removing key «${key}» from localStorage:`, error);
      }
    }
  }, [key, value]);

  const remove = () => {
    setValue(undefined);
  };

  return [value, setValue, remove] as const;
};

export default useLocalStorage;
