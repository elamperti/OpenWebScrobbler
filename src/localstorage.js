/* Looking for the localstorage save filter? See `store/index.js` */
// ToDo: use localforage? (as it's already needed for the adapters anyway)

export function loadState() {
  const serializedState = loadFromLocalStorage('state');
  if (serializedState === null) return undefined;
  return JSON.parse(serializedState) || null;
}

export function saveState(state) {
  const serializedState = JSON.stringify(state);
  saveToLocalStorage('state', serializedState);
}

export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`Saving to local storage failed (${key})`);
  }
}

export function loadFromLocalStorage() {
  try {
    return localStorage.getItem('state');
  } catch (err) {
    return null;
  }
}
