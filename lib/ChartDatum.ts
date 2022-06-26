import { compare as compareSemver } from "semver";
import { type Compare, compareKey, compareNumber } from "./sort";

export interface ChartDatum {
  readonly versionRange: string;
  readonly version: string;
  readonly downloads: number;
}

export const compareVersion: Compare<ChartDatum> = compareKey(
  (i) => i.version,
  compareSemver
);
export const compareDownloads: Compare<ChartDatum> = compareKey(
  (i) => i.downloads,
  compareNumber
);
