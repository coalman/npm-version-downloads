import compareSemver from "semver/functions/compare";
import { type Compare } from "lib/sort";

export const compareLooseSemver: Compare<string> = (a, b) =>
  compareSemver(a, b, { loose: true });
