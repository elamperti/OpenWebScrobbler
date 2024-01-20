import md5 from 'md5';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactGA from 'react-ga-neo';

import useLocalStorage from './useLocalStorage';
import { userGetProfile } from 'utils/clients/api/methods/userGetProfile';
import { userTransformer } from 'utils/clients/api/transformers/user.transformer';
import { saveToLocalStorage } from 'localstorage';

const emptyUser = userTransformer(null);

export const useUserData = () => {
  const [storedUserData, updateStoredUserData] = useLocalStorage('user', emptyUser);
  const { data, isLoading, isFetching, isSuccess, isStale, isError } = useQuery({
    queryKey: ['user', 'self'],
    queryFn: () =>
      userGetProfile().then((data) => {
        updateStoredUserData(data);
        return data;
      }),
    staleTime: 1000 * 60 * 2, // minutes
    refetchOnWindowFocus: true,
    placeholderData: storedUserData,
  });

  useEffect(() => {
    if (isSuccess && data?.user?.name) {
      const hashedUserId = md5(data.user.name);
      ReactGA.set({
        userId: hashedUserId,
      });
      saveToLocalStorage('hashedUID', hashedUserId);
    }
  }, [isSuccess, data]);

  return {
    user: data?.user,
    isLoggedIn: isLoading ? false : data?.isLoggedIn,
    isLoading,
    isError,
    isFetching,
    isReady: !isStale && !isFetching,
  };
};
