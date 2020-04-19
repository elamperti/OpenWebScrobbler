// Various settings
export const AUDIOSCROBBLER_API_URL = 'https://ws.audioscrobbler.com/2.0/'
export const LASTFM_AUTH_URL = `https://www.last.fm/api/auth/?api_key=${process.env.REACT_APP_LASTFM_API_KEY}` +
                               `&cb=${window.location.protocol}//${window.location.host}/`
export const OPENSCROBBLER_API_URL = `//${process.env.REACT_APP_HOST}/api/v2`
export const CONSIDER_HISTORY_STALE_AFTER = 5 * 60 * 1000 // 5 minutes
export const DEBOUNCE_PERIOD = 3 * 1000 // 3 seconds
export const LASTFM_API_RATE_LIMIT = 0 // At this moment is 5 rq/s over 5m per originating IP
export const MAX_RECENT_USERS = 6
// export const DEFAULT_SONG_DURATION = 3; // ToDo: use this value when skipping time forward after scrobble

// Albums view steps
export const ALBUM_VIEW_STEP_SEARCH = 0
export const ALBUM_VIEW_STEP_SRP = 1
export const ALBUM_VIEW_STEP_ARTIST = 2
export const ALBUM_VIEW_STEP_TRACKLIST = 3

// Albums store
export const GET_ALBUM_INFO_LASTFM = 'GET_ALBUM_INFO_LASTFM'
export const SEARCH_ALBUM_LASTFM = 'SEARCH_ALBUM_LASTFM'

// Artists store
export const SEARCH_ARTIST_LASTFM = 'SEARCH_ARTIST_LASTFM'
export const SEARCH_ARTIST_TOP_ALBUMS_LASTFM = 'SEARCH_ARTIST_TOP_ALBUMS_LASTFM'

// Alerts store
export const ALERT_CREATE = 'ALERT_CREATE'
export const ALERT_DISMISS = 'ALERT_DISMISS'
export const ALERT_CLEAR_ALL = 'ALERT_CLEAR_ALL'

// Scrobbles store
export const ENQUEUE_NEW = 'ENQUEUE_NEW'
export const SCROBBLE = 'SCROBBLE'
export const SCROBBLE_COVER_SEARCH = 'SCROBBLE_COVER_SEARCH'
export const CLEAR_SCROBBLES_LIST = 'CLEAR_SCROBBLES_LIST'
export const COUNT_SCROBBLES_ENABLE = 'COUNT_SCROBBLES_ENABLE'
export const COUNT_SCROBBLES_DISABLE = 'COUNT_SCROBBLES_DISABLE'

// Settings store
export const SETTINGS_UPDATE = 'SETTINGS_UPDATE'
export const SETTINGS_SAVE = 'SETTINGS_SAVE'
export const SETTINGS_MODAL_OPEN = 'SETTINGS_MODAL_OPEN'
export const SETTINGS_MODAL_CLOSE = 'SETTINGS_MODAL_CLOSE'

// Users store
export const USER_LOGGED_IN = 'USER_LOGGED_IN'
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT'
export const USER_GET_INFO = 'USER_GET_INFO'
export const FETCH_LASTFM_USER_INFO = 'FETCH_LASTFM_USER_INFO'
export const FETCH_LASTFM_USER_HISTORY = 'FETCH_LASTFM_USER_HISTORY'

// Updates store
export const NEW_VERSION_READY = 'NEW_VERSION_READY'
