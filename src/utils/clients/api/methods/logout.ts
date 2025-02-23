import * as Sentry from '@sentry/react';
import ReactGA from 'react-ga-neo';

import { openscrobblerAPI } from '../apiClient';

export function logout() {
  return openscrobblerAPI.post('/logout.php').finally(() => {
    ReactGA.set({
      userId: undefined,
    });

    const userKeys = ['user', 'token', 'hashedUID', 'recentAlbums', 'recentUsers'];
    userKeys.forEach((key) => localStorage.removeItem(key));

    Sentry.setUser(null);
  });
}
