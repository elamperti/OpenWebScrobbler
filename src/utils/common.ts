import { PROVIDER_DISCOGS, PROVIDER_NAME, Provider } from 'Constants';

export function castArray(x: any): Array<any> {
  return Array.isArray(x) ? x : [x];
}

export function usernameIsValid(str: String) {
  // Should be between 2 and 15 characters, begin with a letter and contain only letters, numbers, '_' or '-'
  return !!str.match(/^(?=[a-zA-Z])[a-zA-Z0-9_.-]{2,15}$/);
}

export function sanitizeProvider(provider: string, defaultProvder: Provider = PROVIDER_DISCOGS) {
  if (provider && Object.hasOwnProperty.call(PROVIDER_NAME, provider)) {
    return provider;
  }
  return defaultProvder;
}
