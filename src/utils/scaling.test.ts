import { describe, expect, test } from 'bun:test';
import { correctRowAspect, TERMINAL_CHAR_ASPECT_RATIO } from './scaling';

describe('correctRowAspect', () => {
  test('divides rows by aspect ratio and floors the result', () => {
    expect(correctRowAspect(17)).toBe(Math.floor(17 / TERMINAL_CHAR_ASPECT_RATIO));
  });

  test('returns 0 for 0 rows', () => {
    expect(correctRowAspect(0)).toBe(0);
  });

  test('handles larger values', () => {
    expect(correctRowAspect(100)).toBe(Math.floor(100 / TERMINAL_CHAR_ASPECT_RATIO));
  });
});
