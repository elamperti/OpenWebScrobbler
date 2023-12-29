// Various settings
export const AUDIOSCROBBLER_API_URL = 'https://ws.audioscrobbler.com/2.0/';
export const DISCOGS_API_URL = '/api/v2/discogs.php';
export const LASTFM_AUTH_URL =
  `https://www.last.fm/api/auth/?api_key=${process.env.REACT_APP_LASTFM_API_KEY}` +
  `&cb=${window.location.protocol}//${window.location.host}/`;
export const OPENSCROBBLER_API_URL = '/api/v2';
export const CONSIDER_HISTORY_STALE_AFTER = 5 * 60 * 1000; // 5 minutes
export const SETTINGS_DEBOUNCE_PERIOD = 3 * 1000; // 3 seconds
export const SCROBBLING_DEBOUNCE_PERIOD = 1.5 * 1000; // 1.5 seconds
export const LASTFM_API_RATE_LIMIT = 0; // At this moment is 5 rq/s over 5m per originating IP
export const MAX_SCROBBLES_PER_REQUEST = 50;
export const MAX_RECENT_USERS = 6;
export const MAX_RECENT_ALBUMS = 8;
export const DEFAULT_SONG_DURATION = 3 * 60; // ToDo: use this value when skipping time forward after scrobble

// ToDo: improve this
export type Provider = 'lastfm' | 'discogs' | 'spotify';

export const PROVIDER_LASTFM: Provider = 'lastfm';
export const PROVIDER_DISCOGS: Provider = 'discogs';
export const PROVIDER_SPOTIFY: Provider = 'spotify';

export const PROVIDER_NAME = {
  [PROVIDER_LASTFM]: 'Last.fm',
  [PROVIDER_DISCOGS]: 'Discogs',
  [PROVIDER_SPOTIFY]: 'Spotify',
};

// Alerts store
export const ALERT_CREATE = 'ALERT_CREATE';
export const ALERT_DISMISS = 'ALERT_DISMISS';
export const ALERT_CLEAR_ALL = 'ALERT_CLEAR_ALL';

// Scrobbles store
export const ENQUEUE_NEW = 'ENQUEUE_NEW';
export const FLUSH_QUEUE = 'FLUSH_QUEUE';
export const SCROBBLE = 'SCROBBLE';
export const SCROBBLE_COVER_SEARCH = 'SCROBBLE_COVER_SEARCH';
export const CLEAR_SCROBBLES_LIST = 'CLEAR_SCROBBLES_LIST';
export const COUNT_SCROBBLES_ENABLE = 'COUNT_SCROBBLES_ENABLE';
export const COUNT_SCROBBLES_DISABLE = 'COUNT_SCROBBLES_DISABLE';

// Users store
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
export const USER_GET_INFO = 'USER_GET_INFO';
export const USER_ADD_RECENT_PROFILE = 'USER_ADD_RECENT_PROFILE';
export const USER_SAVE_INFO = 'USER_SAVE_INFO';
export const GET_ALBUM_INFO = 'GET_ALBUM_INFO';

// Updates store
export const NEW_VERSION_READY = 'NEW_VERSION_READY';

// Referral link generation
export const getAmznLink = (artist, album) => {
  if (artist === album) {
    album = '';
  }
  return (
    atob('aHR0cHM6Ly93d3cuYW1hem9uLmNvbS9ncC9zZWFyY2g/aWU9VVRGOCZpbmRleD1tdXNpYyZrZXl3b3Jkcz0=') +
    encodeURIComponent(`${artist} ${album || ''}`.trim()) +
    atob('JnRhZz1vcGVuc2Nyb2JibGVyLTIwJmxpbmtDb2RlPXVyMiZjYW1wPTE3ODkmY3JlYXRpdmU9OTMyNQ==')
  );
};
