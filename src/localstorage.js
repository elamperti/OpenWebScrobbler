/* Looking for the localstorage save filter? See `store/index.js` */
// ToDo: use localforage? (as it's already needed for the adapters anyway)

function reviveDates(key, value) {
  if (key === 'timestamp') {
    return new Date(value);
  }
  return value;
}

export function loadState() {
  const serializedState = loadFromLocalStorage('state');
  if (serializedState === null) return undefined;
  return JSON.parse(serializedState, reviveDates) || null;
}

export function saveState(state) {
  const serializedState = JSON.stringify(state);
  saveToLocalStorage('state', serializedState);
}

export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Saving to local storage failed (${key})`);
  }
}

export function loadFromLocalStorage() {
  try {
    return localStorage.getItem('state');
  } catch (error) {
    return null;
  }
}
