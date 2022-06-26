export type Compare<T> = (a: T, b: T) => number;

export const compareNumber: Compare<number> = (a, b) => a - b;

/**
 * Reverses the sort order of a compare function.
 */
export function reverseCompare<T>(compare: Compare<T>): Compare<T> {
  return (a, b) => compare(b, a);
}

export function compareKey<I, V>(
  key: (item: I) => V,
  compare: Compare<V>
): Compare<I> {
  return (a, b) => compare(key(a), key(b));
}
