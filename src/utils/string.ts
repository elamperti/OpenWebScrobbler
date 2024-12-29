import type { SongMatch } from 'utils/types/string';

const reAutoPasteSplitting = / - | ?[－–—] ?/;

export function properCase(str: string, forceUcfirstMode = false) {
  if (!str) return '';
  if (str.match(/[A-Z]/u)) {
    return str;
  } else if (forceUcfirstMode) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  }
  return str.replace(/\w+\b/g, (word) => {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
}

export function splitArtistTitleFromText(text: string, reverse: boolean): SongMatch {
  if (reAutoPasteSplitting.test(text)) {
    const result = text.split(reAutoPasteSplitting, 2);

    if (reverse) {
      result.reverse();
    }

    return { artist: result[0], title: result[1] };
  }

  return null;
}
