import { describe, expect, it } from 'vitest';

import { deepMerge } from './objects';

describe('deepMerge', () => {
  it('merges flat objects correctly', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const expected = { a: 1, b: 3, c: 4 };

    expect(deepMerge(target, source)).toEqual(expected);
  });

  it('does not modify original objects', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const originalTarget = { ...target };
    const originalSource = { ...source };

    deepMerge(target, source);

    expect(target).toEqual(originalTarget);
    expect(source).toEqual(originalSource);
  });

  it('handles empty source object', () => {
    const target = { a: 1, b: 2 };
    const source = {};

    expect(deepMerge(target, source)).toEqual(target);
  });

  it('merges nested objects correctly', () => {
    const target = { a: { x: 1, y: 2 }, b: 3 };
    const source = { a: { y: 3, z: 4 } };
    const expected = { a: { x: 1, y: 3, z: 4 }, b: 3 };

    expect(deepMerge<any>(target, source)).toEqual(expected);
  });

  it('preserves arrays instead of merging them', () => {
    const target = { arr: [1, 2, 3], val: 1 };
    const source = { arr: [4, 5] };
    const expected = { arr: [4, 5], val: 1 };

    expect(deepMerge(target, source)).toEqual(expected);
  });

  it('handles deeply nested objects', () => {
    const target = {
      level1: {
        level2: {
          a: 1,
          b: 2,
        },
      },
    };
    const source = {
      level1: {
        level2: {
          b: 3,
          c: 4,
        },
      },
    };
    const expected = {
      level1: {
        level2: {
          a: 1,
          b: 3,
          c: 4,
        },
      },
    };

    expect(deepMerge<any>(target, source)).toEqual(expected);
  });

  it('handles null values', () => {
    const target = { a: 1, b: { x: 1 } };
    const source = { a: null, b: null };
    const expected = { a: null, b: null };

    expect(deepMerge(target, source)).toEqual(expected);
  });
});
