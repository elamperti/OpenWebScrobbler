// Various settings
export const AUDIOSCROBBLER_API_URL = 'https://ws.audioscrobbler.com/2.0/';
export const DISCOGS_API_URL = '/api/v2/discogs.php';
export const LASTFM_AUTH_URL =
  `https://www.last.fm/api/auth/?api_key=${process.env.REACT_APP_LASTFM_API_KEY}` +
  `&cb=${window.location.protocol}//${window.location.host}/`;
export const OPENSCROBBLER_API_URL = '/api/v2';
export const CONSIDER_HISTORY_STALE_AFTER = 5 * 60 * 1000; // 5 minutes
export const DEBOUNCE_PERIOD = 3 * 1000; // 3 seconds
export const LASTFM_API_RATE_LIMIT = 0; // At this moment is 5 rq/s over 5m per originating IP
export const MAX_RECENT_USERS = 6;
export const DEFAULT_SONG_DURATION = 3 * 60; // ToDo: use this value when skipping time forward after scrobble

export const PROVIDER_LASTFM = 'lastfm';
export const PROVIDER_DISCOGS = 'discogs';

// Albums store
export const GET_ALBUM_INFO_LASTFM = 'GET_ALBUM_INFO_LASTFM';
export const GET_ALBUM_INFO_DISCOGS = 'GET_ALBUM_INFO_DISCOGS';
export const SEARCH_ALBUM_LASTFM = 'SEARCH_ALBUM_LASTFM';
export const SEARCH_ALBUM_DISCOGS = 'SEARCH_ALBUM_DISCOGS';
export const SEARCH_TOP_ALBUMS_LASTFM = 'SEARCH_TOP_ALBUMS_LASTFM';
export const SEARCH_TOP_ALBUMS_DISCOGS = 'SEARCH_TOP_ALBUMS_DISCOGS';
export const SET_ALBUM_QUERY = 'SET_ALBUM_QUERY';
export const SET_ARTIST_QUERY = 'SET_ARTIST_QUERY';
export const CLEAR_ALBUM_SEARCH = 'CLEAR_ALBUM_SEARCH';
export const CLEAR_ALBUM_ARTIST_SEARCH = 'CLEAR_ALBUM_ARTIST_SEARCH';
export const CLEAR_ALBUM_TRACKLIST = 'CLEAR_ALBUM_TRACKLIST';

// Artists store
export const SEARCH_ARTIST_LASTFM = 'SEARCH_ARTIST_LASTFM';
export const SEARCH_ARTIST_DISCOGS = 'SEARCH_ARTIST_DISCOGS';

// Alerts store
export const ALERT_CREATE = 'ALERT_CREATE';
export const ALERT_DISMISS = 'ALERT_DISMISS';
export const ALERT_CLEAR_ALL = 'ALERT_CLEAR_ALL';

// Scrobbles store
export const ENQUEUE_NEW = 'ENQUEUE_NEW';
export const SCROBBLE = 'SCROBBLE';
export const SCROBBLE_COVER_SEARCH = 'SCROBBLE_COVER_SEARCH';
export const CLEAR_SCROBBLES_LIST = 'CLEAR_SCROBBLES_LIST';
export const COUNT_SCROBBLES_ENABLE = 'COUNT_SCROBBLES_ENABLE';
export const COUNT_SCROBBLES_DISABLE = 'COUNT_SCROBBLES_DISABLE';

// Settings store
export const SETTINGS_UPDATE = 'SETTINGS_UPDATE';
export const SETTINGS_SAVE = 'SETTINGS_SAVE';
export const SETTINGS_MODAL_OPEN = 'SETTINGS_MODAL_OPEN';
export const SETTINGS_MODAL_CLOSE = 'SETTINGS_MODAL_CLOSE';
export const SETTINGS_SET_DATA_PROVIDER = 'SETTINGS_SET_DATA_PROVIDER';

// Users store
export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
export const USER_GET_INFO = 'USER_GET_INFO';
export const FETCH_LASTFM_USER_INFO = 'FETCH_LASTFM_USER_INFO';
export const FETCH_LASTFM_USER_HISTORY = 'FETCH_LASTFM_USER_HISTORY';

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
