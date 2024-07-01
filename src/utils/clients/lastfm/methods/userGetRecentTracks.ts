import { lastfmAPI } from '../apiClient';
import { userRecentTracksTransformer } from '../transformers/userRecentTracks.transformer';


export async function userGetRecentTracks(username: string, page = 1) {
  const response = await lastfmAPI.get('', {
    params: {
      method: 'user.getRecentTracks',
      user: username,
      page,
    },
  });

  return userRecentTracksTransformer(response);
}
