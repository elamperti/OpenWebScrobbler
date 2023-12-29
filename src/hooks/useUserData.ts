import { useQuery } from '@tanstack/react-query';
import useLocalStorage from './useLocalStorage';
import { userGetProfile } from 'utils/clients/api/methods/userGetProfile';
import { userTransformer } from 'utils/clients/api/transformers/user.transformer';

const emptyUser = userTransformer(null);

export const useUserData = () => {
  const [storedUserData, updateStoredUserData] = useLocalStorage('user', emptyUser);
  const { data, isLoading, isFetching } = useQuery({
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

  return {
    user: data?.user,
    isLoggedIn: isLoading ? false : data?.isLoggedIn,
    isLoading,
    isFetching,
  };
};
