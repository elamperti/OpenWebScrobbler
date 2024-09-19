import { useEffect } from 'react';
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userGetSettings } from 'utils/clients/api/methods/userGetSettings';
import { settingsUpdate } from 'utils/clients/api/methods/settingsUpdate';
import type { Settings } from 'utils/types/settings';
import { useLanguage } from './useLanguage';
import { useUserData } from './useUserData';

export type UseSettingsResult = {
  settings: Settings;
  updateSettings: UseMutateFunction<Settings, Error, Partial<Settings>, unknown>;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  isReady: boolean;
  isSuccess: boolean;
};

export type UseSettingsHook = () => UseSettingsResult;

export const useSettings: UseSettingsHook = () => {
  const queryClient = useQueryClient();
  const { currentLanguage, setLanguage } = useLanguage();
  const { isReady: userIsReady, isLoggedIn } = useUserData();

  const { data, isLoading, isFetching, isSuccess, isFetched, isError } = useQuery({
    queryKey: ['user', 'settings'],
    queryFn: userGetSettings,
    staleTime: Infinity,
    enabled: userIsReady && !!isLoggedIn,
  });

  const updateLang = (lang: string | undefined) => {
    if (lang && currentLanguage !== lang) {
      setLanguage(lang as string);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => updateLang(data?.lang), [data]);

  const saveSettings = useMutation({
    mutationFn: (newSettings: Partial<Settings>) => settingsUpdate(newSettings),
    onSuccess: (newData) => {
      queryClient.setQueryData(['user', 'settings'], newData);
      updateLang(newData?.lang);
    },
  });

  return {
    settings: data,
    updateSettings: saveSettings.mutate,
    isLoading,
    isError,
    isFetching,
    isReady: isFetched,
    isSuccess,
  };
};
