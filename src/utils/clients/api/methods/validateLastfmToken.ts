import { openscrobblerAPI } from '../apiClient';
import { callbackTransformer } from '../transformers/callback.transformer';


export function validateLastfmToken(token: string) {
  const params = new URLSearchParams();
  params.append('token', token);

  return openscrobblerAPI.post('/callback.php', params).then(({ data }) => callbackTransformer(data));
}
