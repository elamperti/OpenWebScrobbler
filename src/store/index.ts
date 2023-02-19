import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import promise from 'redux-promise-middleware';
import createDebounce from 'redux-debounced';
import throttle from 'lodash/throttle';

import { loadState, saveState } from 'localstorage';

import albumReducer from './reducers/albumReducer';
import alertReducer from './reducers/alertReducer';
import artistReducer from './reducers/artistReducer';
import scrobbleReducer from './reducers/scrobbleReducer';
import settingsReducer from './reducers/settingsReducer';
import updatesReducer from './reducers/updatesReducer';
import userReducer from './reducers/userReducer';

const middlewares = [createDebounce(), promise];
const isDevEnvironment = process.env.NODE_ENV === 'development';
const hasDevTools = typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

if (isDevEnvironment && !hasDevTools) {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

const persistedState = loadState();

const store = createStore(
  combineReducers({
    album: albumReducer,
    alerts: alertReducer,
    artist: artistReducer,
    scrobbles: scrobbleReducer,
    settings: settingsReducer,
    updates: updatesReducer,
    user: userReducer,
  }),
  persistedState,
  (isDevEnvironment && hasDevTools ? composeWithDevTools({}) : compose)(applyMiddleware(...middlewares))
);

store.subscribe(
  throttle(() => {
    const state = store.getState();
    saveState({
      scrobbles: {
        ...state.scrobbles,
        list: state.scrobbles.list
          .filter((scrobble) => scrobble.status !== 'queued' && scrobble.status !== 'pending')
          .slice(-100),
      },
      user: {
        ...state.user,
        userSettingsLoading: false,
        profiles: {},
      },
      settings: {
        ...state.settings,
        modalIsOpen: false,
      },
    });
  }, 2000)
);

export type RootState = ReturnType<typeof store.getState>;

export default store;
