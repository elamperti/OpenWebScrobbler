import { PROVIDER_DISCOGS, PROVIDER_NAME, Provider } from 'Constants';
import type { Scrobble } from './types/scrobble';

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

export function replaceLastOccurrence(fullString: string, lastString: string, replaceString: string) {
  const lastStringIndex = fullString.lastIndexOf(lastString);

  if (lastStringIndex === -1) {
    return fullString;
  }

  return (
    `${fullString.substring(0, lastStringIndex)}${replaceString}${fullString.substring(lastStringIndex + lastString.length)}`
  );
};

export function cleanupLastEndStringOccurrence(fullString: string, pattern: string) {
  if (fullString.endsWith(pattern)) {
    return fullString.substring(0, fullString.length - pattern.length).trim();
  }

  return fullString;
}

export function keyOfLongestArray(objectOfArrays: Record<string, Scrobble[]>): string {
  let keyOfLongestArray: string = null;
  let longestArrayLength = -1;

  for (const [arrayKey, arrayItems] of Object.entries(objectOfArrays)) {
    if (arrayItems.length >= longestArrayLength) {
      longestArrayLength = arrayItems.length;
      keyOfLongestArray = arrayKey;
    }
  }

  return keyOfLongestArray;
}

export async function sha256(str: string) {
  const msgUint8 = new TextEncoder().encode(str); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}
