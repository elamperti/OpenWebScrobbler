import type { SongMatch } from 'utils/types/string';

const reAutoPasteSplitting = / - | ?[－–—] ?/;

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
