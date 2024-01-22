import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useGrowthBook } from '@growthbook/growthbook-react';
import ReactGA from 'react-ga-neo';

import useLocalStorage from './useLocalStorage';
import { userGetProfile } from 'utils/clients/api/methods/userGetProfile';
import { userTransformer } from 'utils/clients/api/transformers/user.transformer';
import { sha256 } from 'utils/common';
import { saveToLocalStorage } from 'localstorage';

const emptyUser = userTransformer(null);

export const useUserData = () => {
  const [storedUserData, updateStoredUserData] = useLocalStorage('user', emptyUser);
  const growthbook = useGrowthBook();
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
      sha256(data.user.name).then((hashedUserId) => {
        ReactGA.set({
          userId: hashedUserId,
        });
        if (process.env.REACT_APP_GROWTHBOOK_API_KEY) {
          growthbook.setAttributes({
            ...growthbook.getAttributes(),
            loggedIn: true,
            id: hashedUserId,
          });
        }
        saveToLocalStorage('hashedUID', hashedUserId);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
