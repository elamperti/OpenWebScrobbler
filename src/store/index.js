import { createStore, combineReducers, applyMiddleware } from 'redux';
import promise from 'redux-promise-middleware';
import createDebounce from 'redux-debounced';
import throttle from 'lodash/throttle';

import { loadState, saveState } from 'localstorage';

import scrobbleReducer from './reducers/scrobbleReducer';
import userReducer from './reducers/userReducer';
import alertReducer from './reducers/alertReducer';
import settingsReducer from './reducers/settingsReducer';
import updatesReducer from './reducers/updatesReducer';

const middlewares = [
  createDebounce(),
  promise(),
];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

const persistedState = loadState();

const store = createStore(
  combineReducers({
    scrobbles: scrobbleReducer,
    alerts: alertReducer,
    user: userReducer,
    settings: settingsReducer,
    updates: updatesReducer,
  }),
  persistedState,
  applyMiddleware(...middlewares)
);

store.subscribe(throttle(() => {
  let state = store.getState();
  saveState({
    scrobbles: {
      ...state.scrobbles,
      list: state.scrobbles.list.filter(scrobble => scrobble.status !== 'pending').slice(-50),
    },
    user: {
      ...state.user,
      userSettingsLoading: false,
    },
    settings: state.settings,
  });
}, 2000));

export default store;
