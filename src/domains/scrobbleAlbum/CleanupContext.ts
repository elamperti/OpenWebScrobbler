import { createContext } from 'react';
import { escapeRegExp } from 'lodash-es';

export type CleanupContext = {
  // this type represents the content of the context, it's a regexp value (cleanupPattern) and the corresponidng state setter (setCleanupPattern)
  cleanupPattern: RegExp | null;
  setCleanupPattern: (pattern?: RegExp) => void;
};

type BreakStringResult = {
  value: string;
  isMatch: boolean;
};

export const CleanupPatternContext = createContext<CleanupContext>({
  cleanupPattern: null,
  setCleanupPattern: () => {},
});

export function cleanTitleWithPattern(title: string, pattern: RegExp): string {
  if (!pattern) return title;

  return breakStringUsingPattern(title, pattern)
    .filter(({ isMatch }) => !isMatch)
    .reduce((acc, { value }) => acc + value, '')
    .trim();
}

/**
 * Converts a string into a regular expression, to be used as cleanup pattern
 * @param str string to be converted to pattern
 * @returns regular expression using the given string
 */
export function strToCleanupPattern(str: string): RegExp {
  if (!str || str.trim().length < 3) return;
  const startsWithWord = str.match(/^\w/);
  const prefix = startsWithWord ? '\\s?\\b' : ''; // disallow partial words

  let postfix = '';
  if (startsWithWord) {
    // disallow partial words
    postfix = '\\s?\\b';
  } else if (str.match(/^[([]/)) {
    // auto-close parenthesis and brackets
    postfix = '[\\)\\]]?';
  }
  return new RegExp(`${prefix}${escapeRegExp(str)}${postfix}`, 'ig');
}

/**
 * Breaks down the given string into pieces that match (or don't match) the given pattern
 * @param str string to break down into parts
 * @param pattern pattern to use to break down the string
 */
export function breakStringUsingPattern(str: string, pattern: RegExp): BreakStringResult[] {
  if (!str) return [];

  const __stringCrumble = (value: string, isMatch: boolean): BreakStringResult => ({
    value,
    isMatch,
  });

  if (!pattern) return [__stringCrumble(str, false)];

  const matches = str.matchAll(pattern);

  if (!matches) return [__stringCrumble(str, false)];

  const crumbles = [] as BreakStringResult[];
  const splitStr = str.split(pattern);

  splitStr.forEach((part, index) => {
    // This block checks interactions between valid parts for invalid combinations
    // (extra spaces, empty parenthesis/brackets, more than one dash)
    if (index > 0) {
      let previous = splitStr[index - 1];

      if (previous.match(/ +$/) && part.match(/^(\s|$)/)) {
        // modify the previous crumble to remove the space
        previous = previous.trimEnd();
        crumbles[crumbles.length - 2].value = previous;
        // and add the space to the corresponding match
        crumbles[crumbles.length - 1].value = ' ' + crumbles[crumbles.length - 1].value;
      }

      if (previous.endsWith('(') && part.startsWith(')')) {
        // modify the previous crumble to remove the empty parenthesis
        crumbles[crumbles.length - 2].value = previous.slice(0, -1);
        // add it to the corresponding match
        crumbles[crumbles.length - 1].value = `(${crumbles[crumbles.length - 1].value})`;
        // and remove it from the part we're currently processing
        part = part.slice(1);
      }

      if (previous.endsWith('[') && part.startsWith(']')) {
        // modify the previous crumble to remove the empty brackets
        crumbles[crumbles.length - 2].value = previous.slice(0, -1);
        // add it to the corresponding match
        crumbles[crumbles.length - 1].value = `[${crumbles[crumbles.length - 1].value}]`;
        // and remove it from the part we're currently processing
        part = part.slice(1);
      }

      if (previous.match(/[-–—]$/) && (!part || part.match(/^\s*[-–—]/))) {
        const removedChar = previous.at(-1);
        // modify the previous crumble to remove the extra dash
        crumbles[crumbles.length - 2].value = previous.slice(0, -1);
        // and add it to the corresponding match
        crumbles[crumbles.length - 1].value = removedChar + crumbles[crumbles.length - 1].value;
      }
    }

    // Then we add the current part to the crumbles array
    crumbles.push(__stringCrumble(part, false));

    // And its corresponding match, if there is one
    const match = matches.next();
    if (match.done) return;
    crumbles.push(__stringCrumble(match.value[0], true));
  });

  return crumbles.filter((crumble) => crumble.value);
}
