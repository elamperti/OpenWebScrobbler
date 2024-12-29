import { useDispatch } from 'react-redux';
import ReactGA from 'react-ga-neo';

import { enqueueScrobble } from 'store/actions/scrobbleActions';
import type { Scrobble } from 'utils/types/scrobble';
import { cleanTitleWithPattern } from 'domains/scrobbleAlbum/CleanupContext';

export function useScrobbleAgain(
  scrobble: Scrobble,
  useOriginalTimestamp: boolean,
  analyticsEvent = 'Scrobble again',
  cleanupPattern?: RegExp
) {
  const dispatch = useDispatch();

  return () => {
    ReactGA.event({
      category: 'Interactions',
      action: analyticsEvent,
    });
    enqueueScrobble(dispatch)([
      {
        ...scrobble,
        title: cleanTitleWithPattern(scrobble.title, cleanupPattern),
        timestamp: useOriginalTimestamp ? scrobble.timestamp : new Date(),
      },
    ]);
  };
}
