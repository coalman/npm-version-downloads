export type Compare<T> = (a: T, b: T) => number;

export const compareNumber: Compare<number> = (a, b) => a - b;

/**
 * Reverses the sort order of a compare function.
 */
export function reverseCompare<T>(compare: Compare<T>): Compare<T> {
  return (a, b) => compare(b, a);
}

export function compareField<I, K extends keyof I>(
  key: K,
  compare: Compare<I[K]>
): Compare<I> {
  return (a, b) => compare(a[key], b[key]);
}

export type FieldComparators<T> = {
  [K in keyof T]: Compare<T[K]>;
};

export class FieldComparatorMap<T> {
  #comparators: FieldComparators<T>;

  constructor(comparators: FieldComparators<T>) {
    this.#comparators = comparators;
  }

  get<K extends keyof T>(key: K): Compare<T> {
    return compareField(key, this.#comparators[key]);
  }
}

export function compareKey<I, V>(
  key: (item: I) => V,
  compare: Compare<V>
): Compare<I> {
  return (a, b) => compare(key(a), key(b));
}
