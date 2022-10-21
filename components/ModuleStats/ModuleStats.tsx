import { type FC, Fragment, useMemo, useState } from "react";
import semverParse from "semver/functions/parse";
import { reverseCompare, compareField } from "lib/sort";
import { compareLooseSemver } from "lib/semver";
import { VersionTable } from "../VersionTable";
import VersionDownloadsBarChart from "./VersionDownloadsBarChart";
import clsx from "clsx";

export interface ChartDatum {
  readonly versionRange: string;
  readonly version: string;
  readonly downloads: number;
}

const xAccessor = (d: ChartDatum) => d.versionRange;
const yAccessor = (d: ChartDatum) => d.downloads;

const ModuleStats: FC<{
  moduleName: string | undefined;
  versionsDownloads: Record<string, number>;
}> = (props) => {
  const [selectedDatum, setSelectedDatum] = useState<ChartDatum | undefined>();

  const majorVersionGroups = useMemo(
    () => groupByMajorVersion(props.versionsDownloads),
    [props.versionsDownloads]
  );

  const selectedData = useMemo(
    () => selectedDatum && majorVersionGroups.get(selectedDatum.versionRange),
    [selectedDatum, majorVersionGroups]
  );

  const chartData = useMemo(() => {
    return Array.from(majorVersionGroups.entries())
      .map(([versionRange, { version, items }]) => ({
        versionRange,
        version,
        downloads: items.reduce((sum, { downloads }) => sum + downloads, 0),
      }))
      .sort(reverseCompare(compareField("version", compareLooseSemver)));
  }, [majorVersionGroups]);

  return (
    <Fragment>
      <h1 className="font-bold text-2xl">
        <button type="button" onClick={() => setSelectedDatum(undefined)}>
          {props.moduleName}
        </button>
      </h1>
      <div
        className={clsx(
          "[width:400px] [height:300px]",
          "md:[width:600px] md:[height:400px]"
        )}
      >
        <VersionDownloadsBarChart
          data={chartData}
          xAccessor={xAccessor}
          yAccessor={yAccessor}
          onPointerUp={setSelectedDatum}
        />
      </div>
      {props.moduleName && (
        <VersionTable
          // if there is no selected data, just show the top level major version data
          data={selectedData?.items ?? chartData}
          selectionName={selectedDatum?.versionRange ?? props.moduleName}
        />
      )}
    </Fragment>
  );
};

export default ModuleStats;

function semverMajor(version: string): number {
  const majorVersion = semverParse(version, { loose: true })?.major;
  if (majorVersion === undefined) {
    throw new Error(`Wasn't able to parse "${version}" semver string.`);
  }
  return majorVersion;
}

const majorVersionRange = (majorVersion: number): string => `${majorVersion}.X`;

export type VersionGroup = {
  version: string;
  items: Array<{ version: string; downloads: number }>;
};

export function groupByMajorVersion(
  versionDownloads: Readonly<Record<string, number>>
): ReadonlyMap<string, VersionGroup> {
  const items = [...Object.entries(versionDownloads)].map(
    ([version, downloads]) => ({ version, downloads })
  );

  const groups = new Map<string, VersionGroup>();
  for (const item of items) {
    const majorVersion = majorVersionRange(semverMajor(item.version));

    let group = groups.get(majorVersion);
    if (group === undefined) {
      group = { version: `${semverMajor(item.version)}.0.0`, items: [] };
      groups.set(majorVersion, group);
    }
    group.items.push(item);
  }

  return groups;
}
