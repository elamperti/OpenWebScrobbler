import { useEffect, useState } from 'react';

import type { Dispatch, SetStateAction } from 'react';

export type UseLocalStorageParamKey = string;

export type UseLocalStorageParamValue<T> = T | undefined;

export type UseLocalStorageResult<T> = [value: T, setValue: Dispatch<SetStateAction<T>>, remove: () => void];

export type UseLocalStorageHook = <T>(
  key: UseLocalStorageParamKey,
  defaultValue?: UseLocalStorageParamValue<T>
) => UseLocalStorageResult<T>;

const useLocalStorage: UseLocalStorageHook = <T>(key: string, defaultValue?: T) => {
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
