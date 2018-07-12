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
    console.warn(`Saving to local storage failed (${key})`);
  }
}

export function loadFromLocalStorage(key) {
  try {
    return localStorage.getItem('state');
  } catch (err) {
    return null;
  }
}
