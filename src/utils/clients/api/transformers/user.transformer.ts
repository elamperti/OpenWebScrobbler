import { avatarTransformer } from 'utils/clients/lastfm/transformers/avatar.transformer';
import { User } from 'utils/types/user';


export function userTransformer(raw: any) {
  const username = raw?.user?.name || '';

  return {
    user: {
      id: raw?.user?.id || null,
      name: username,
      avatar: avatarTransformer(raw?.user?.image),
      url: raw?.user?.url || null,
    } as User,
    isLoggedIn: typeof raw?.isLoggedIn === 'boolean' ? raw.isLoggedIn : !!username,
  };
}
