import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useLocalStorage from './useLocalStorage';
import { settingsTransformer } from 'utils/clients/api/transformers/settings.transformer';
import { userGetSettings } from 'utils/clients/api/methods/userGetSettings';
import { settingsUpdate } from 'utils/clients/api/methods/settingsUpdate';
import { Settings } from 'utils/types/settings';
import { useLanguage } from './useLanguage';
import { useUserData } from './useUserData';

const defaultSettings = settingsTransformer({});

export const useSettings = () => {
  const queryClient = useQueryClient();
  const [storedSettings, updateStoredSettings] = useLocalStorage('settings', defaultSettings);
  const { currentLanguage, setLanguage } = useLanguage();
  const { isLoggedIn } = useUserData();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['user', 'settings'],
    queryFn: () =>
      userGetSettings().then((data) => {
        updateStoredSettings(data);
        return data;
      }),
    staleTime: Infinity,
    enabled: !!isLoggedIn,
    // placeholderData: storedSettings,
  });

  const updateLang = (lang: String | undefined) => {
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
    isFetching,
  };
};
