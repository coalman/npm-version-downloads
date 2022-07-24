import compareSemver from "semver/functions/compare";
import { type Compare } from "lib/sort";

export interface VersionDownloads {
  readonly version: string;
  readonly downloads: number;
}

export function groupBy<T>(
  data: readonly T[],
  getGroup: (datum: T) => string
): Map<string, T[]> {
  const groups = new Map<string, T[]>();

  for (const datum of data) {
    const key = getGroup(datum);
    let group = groups.get(key);
    if (group === undefined) {
      group = [];
      groups.set(key, group);
    }
    group.push(datum);
  }

  return groups;
}

export const compareLooseSemver: Compare<string> = (a, b) =>
  compareSemver(a, b, { loose: true });
