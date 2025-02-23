import { openscrobblerAPI } from '../apiClient';
import { callbackTransformer } from '../transformers/callback.transformer';
import { saveToLocalStorage } from 'localstorage';

export function validateLastfmToken(token: string) {
  const params = new URLSearchParams();
  params.append('token', token);

  return openscrobblerAPI.post('/callback.php', params).then(({ data: rawData }) => {
    const data = callbackTransformer(rawData);

    // JWT
    if (data.success && data?.token) {
      saveToLocalStorage('token', data.token);
    }

    return data;
  });
}
