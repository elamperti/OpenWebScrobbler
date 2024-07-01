import { composeWithDevTools } from '@redux-devtools/extension';
import { loadState, saveState } from 'localstorage';
import { throttle } from 'lodash-es';
import { legacy_createStore as createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createDebounce from 'redux-debounced';
import promise from 'redux-promise-middleware';

import alertReducer from './reducers/alertReducer';
import scrobbleReducer from './reducers/scrobbleReducer';


const middlewares = [createDebounce(), promise];
const isDevEnvironment = process.env.NODE_ENV === 'development';
const hasDevTools = typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const persistedState = loadState();

const store = createStore(
  combineReducers({
    alerts: alertReducer,
    scrobbles: scrobbleReducer,
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
    });
  }, 2000)
);

export type RootState = ReturnType<typeof store.getState>;

export default store;
