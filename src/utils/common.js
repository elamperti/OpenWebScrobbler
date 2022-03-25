export function castArray(x) {
  return Array.isArray(x) ? x : [x];
}

export function usernameIsValid(str) {
  // Should be between 2 and 15 characters, begin with a letter and contain only letters, numbers, '_' or '-'
  return !!str.match(/^(?=[a-zA-Z])[a-zA-Z0-9_.-]{2,15}$/);
}
