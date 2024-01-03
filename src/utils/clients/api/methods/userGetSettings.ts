import { openscrobblerAPI } from '../apiClient';
import { settingsTransformer } from '../transformers/settings.transformer';

export function userGetSettings() {
  // ToDo: debounce
  return openscrobblerAPI.get('/settings.php').then(({ data }) => settingsTransformer(data));
}
