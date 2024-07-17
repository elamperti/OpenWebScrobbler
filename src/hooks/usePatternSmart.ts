import { useMemo } from 'react';
import { keyOfLongestArray } from 'utils/common';
import type { Scrobble } from 'utils/types/scrobble';

export type UsePatternSmartParams = {
  pattern?: string;
  totalTrackNames: Scrobble[];
};

export type UsePatternSmartResult = string;

export type UsePatternSmartHook = (params: UsePatternSmartParams) => UsePatternSmartResult;

const USE_PATTERN_SMART_EXTRA_CHARS = ['-', '- ', '/', '/ '];

export const usePatternSmart: UsePatternSmartHook = ({ pattern, totalTrackNames }) => {
  const allPatterns = useMemo<Record<string, Scrobble[]>>(() => {
    const patterns: Record<string, Scrobble[]> = {};

    USE_PATTERN_SMART_EXTRA_CHARS.forEach((extraChar: string) => {
      totalTrackNames.forEach((track: Scrobble) => {
        if (track.title.endsWith(extraChar + pattern)) {
          patterns[extraChar] ??= [];
          patterns[extraChar].push(track);
        }
      });
    });

    return patterns;
  }, [pattern, totalTrackNames]);

  if (!pattern) {
    return '';
  }

  return Object.keys(allPatterns).length > 0 ? `${keyOfLongestArray(allPatterns)}${pattern}` : pattern;
};
