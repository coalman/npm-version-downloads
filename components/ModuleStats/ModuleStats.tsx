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
  const [groupMode] = useState<"major" | "minor">(() => {
    const majorVersions = allMajorVersions(props.versionsDownloads);
    return majorVersions.size > 2 ? "major" : "minor";
  });

  const versionGroups = useMemo(
    () => createVersionGroups(groupMode, props.versionsDownloads),
    [props.versionsDownloads]
  );

  const selectedData = useMemo(
    () => selectedDatum && versionGroups.get(selectedDatum.versionRange),
    [selectedDatum, versionGroups]
  );

  const chartData = useMemo(() => {
    return Array.from(versionGroups.entries())
      .map(([versionRange, { version, items }]) => ({
        versionRange,
        version,
        downloads: items.reduce((sum, { downloads }) => sum + downloads, 0),
      }))
      .sort(reverseCompare(compareField("version", compareLooseSemver)));
  }, [versionGroups]);

  return (
    <Fragment>
      <h1 className="font-bold text-2xl">
        <a href={`https://npmjs.com/package/${props.moduleName}`}>
          {props.moduleName}
        </a>
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
      <div className="relative">
        {selectedDatum !== undefined && (
          <button
            className="absolute right-0 px-2 border border-slate-400"
            type="button"
            onClick={() => setSelectedDatum(undefined)}
          >
            Back
          </button>
        )}
        {props.moduleName && (
          <VersionTable
            // if there is no selected data, just show the top level major version data
            data={selectedData?.items ?? chartData}
            selectionName={selectedDatum?.versionRange ?? props.moduleName}
          />
        )}
      </div>
    </Fragment>
  );
};

export default ModuleStats;

function parseSemver(version: string) {
  const parsedVersion = semverParse(version, { loose: true });
  if (parsedVersion === undefined || parsedVersion === null) {
    throw new Error(`Wasn't able to parse "${version}" semver string.`);
  }
  return parsedVersion;
}

function allMajorVersions(
  versionDownloads: Readonly<Record<string, number>>
): ReadonlySet<number> {
  const majorVersions = new Set<number>();
  for (const version of Object.keys(versionDownloads)) {
    const { major } = parseSemver(version);
    majorVersions.add(major);
  }
  return majorVersions;
}

export type VersionGroup = {
  version: string;
  items: Array<{ version: string; downloads: number }>;
};

export function createVersionGroups(
  groupMode: "major" | "minor",
  versionDownloads: Readonly<Record<string, number>>
): ReadonlyMap<string, VersionGroup> {
  const items = [...Object.entries(versionDownloads)].map(
    ([version, downloads]) => ({ version, downloads })
  );

  const groups = new Map<string, VersionGroup>();
  for (const item of items) {
    const { major, minor } = parseSemver(item.version);
    const { version, versionGroup } =
      groupMode === "major"
        ? {
            version: `${major}.0.0`,
            versionGroup: `${major}.X`,
          }
        : {
            version: `${major}.${minor}.0`,
            versionGroup: `${major}.${minor}.X`,
          };

    let group = groups.get(versionGroup);
    if (group === undefined) {
      group = { version, items: [] };
      groups.set(versionGroup, group);
    }
    group.items.push(item);
  }

  return groups;
}
