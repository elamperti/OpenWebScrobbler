import { get } from 'lodash-es';
import { avatarTransformer } from './avatar.transformer';

export function userProfileTransformer(response: any) {
  const userData = response?.data?.user || {};
  let avatar = null;

  if (userData.image) {
    avatar = avatarTransformer(get(userData, 'image') as any[]);
  }

  return {
    name: userData.name || '',
    url: userData.url || '',
    // country: userData.country || '',
    avatar,
  };
}
