import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import useLocalStorage from './useLocalStorage';
import { settingsTransformer } from 'utils/clients/api/transformers/settings.transformer';
import { userGetSettings } from 'utils/clients/api/methods/userGetSettings';
import { settingsUpdate } from 'utils/clients/api/methods/settingsUpdate';
import { Settings } from 'utils/types/settings';
import { useLanguage } from './useLanguage';

const defaultSettings = settingsTransformer({});

export const useSettings = () => {
  const queryClient = useQueryClient();
  const [storedSettings, updateStoredSettings] = useLocalStorage('settings', defaultSettings);
  const { setLanguage } = useLanguage();

  const { data, isLoading, isFetching } = useSuspenseQuery({
    queryKey: ['user', 'settings'],
    queryFn: () =>
      userGetSettings().then((data) => {
        updateStoredSettings(data);
        return data;
      }),
    staleTime: Infinity,
    // placeholderData: storedSettings,
  });

  const saveSettings = useMutation({
    mutationFn: (newSettings: Partial<Settings>) => settingsUpdate(newSettings),
    onSuccess: (data) => {
      queryClient.setQueryData(['user', 'settings'], data);
      if (data.lang) {
        setLanguage(data.lang);
      }
    },
  });

  return {
    settings: data,
    updateSettings: saveSettings.mutate,
    isLoading,
    isFetching,
  };
};
