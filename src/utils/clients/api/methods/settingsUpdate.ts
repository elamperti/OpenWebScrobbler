import { openscrobblerAPI } from '../apiClient';
import { settingsTransformer } from '../transformers/settings.transformer';

import type { Settings } from 'utils/types/settings';

function objectToSearchParams(obj: { [key: string]: any }) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    params.append(key, `${value}`);
  });
  return params;
}

export function settingsUpdate(newSettings: Partial<Settings>) {
  return openscrobblerAPI
    .post('/settings.php', objectToSearchParams(newSettings))
    .then(({ data }) => settingsTransformer(data));
}
