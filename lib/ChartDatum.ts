import { compare as compareSemver } from "semver";
import semverParse from "semver/functions/parse";
import { type Compare, compareKey, compareNumber } from "./sort";

export interface ChartDatum {
  readonly versionRange: string;
  readonly version: string;
  readonly downloads: number;
}

export const compareVersion: Compare<ChartDatum> = compareKey((i) => {
  const version = semverParse(i.version, { loose: true })?.version;
  if (version === undefined) {
    throw new Error(`Wasn't able to parse "${i.version}" semver string.`);
  }
  return version;
}, compareSemver);
export const compareDownloads: Compare<ChartDatum> = compareKey(
  (i) => i.downloads,
  compareNumber
);
