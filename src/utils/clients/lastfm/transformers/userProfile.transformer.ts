import { avatarTransformer } from './avatar.transformer';

export function userProfileTransformer(response: any) {
  const userData = response?.data?.user || {};
  let avatar = null;

  if (Array.isArray(userData.image)) {
    avatar = avatarTransformer(userData.image as any[]);
  }

  return {
    name: userData.name || '',
    url: userData.url || '',
    // country: userData.country || '',
    avatar,
  };
}
