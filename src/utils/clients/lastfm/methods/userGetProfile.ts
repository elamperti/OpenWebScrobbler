import { lastfmAPI } from '../apiClient';
import { userProfileTransformer } from '../transformers/userProfile.transformer';

export async function userGetProfile(username: string) {
  const response = await lastfmAPI.get('', {
    params: {
      method: 'user.getInfo',
      user: username,
    },
  });

  return userProfileTransformer(response);
}
