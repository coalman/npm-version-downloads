import { type FC, Fragment, useMemo, useState } from "react";
import semverParse from "semver/functions/parse";
import { reverseCompare, compareField } from "lib/sort";
import { compareLooseSemver } from "./ChartData";
import { VersionTable } from "../VersionTable";
import VersionDownloadsBarChart from "./VersionDownloadsBarChart";

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
  const chartData = useMemo(
    () => groupByMajorVersion(props.versionsDownloads),
    [props.versionsDownloads]
  );

  const [selectedDatum, setSelectedDatum] = useState<ChartDatum | undefined>();

  const selectedDatumBreakdown = useMemo(() => {
    if (selectedDatum === undefined) {
      return undefined;
    } else {
      return filterByMajorVersion(
        selectedDatum.versionRange,
        props.versionsDownloads
      );
    }
  }, [selectedDatum, props.versionsDownloads]);

  return (
    <Fragment>
      <h1 className="font-bold text-2xl">
        <a
          href="javascript:void(0);"
          onClick={(event) => {
            setSelectedDatum(undefined);
            event.preventDefault();
          }}
        >
          {props.moduleName}
        </a>
      </h1>
      <div style={{ width: 600, height: 400 }}>
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
          data={selectedDatumBreakdown ?? chartData}
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

export function filterByMajorVersion(
  selectedVersionRange: string,
  versionsDownloads: Record<string, number>
): ChartDatum[] {
  return (
    Object.entries(versionsDownloads)
      .map(([version, downloads]) => ({
        versionRange: majorVersionRange(semverMajor(version)),
        version,
        downloads,
      }))
      // selectedDatum is assumed to be an aggregate by major version
      .filter((datum) => datum.versionRange === selectedVersionRange)
  );
}

export function groupByMajorVersion(
  versionsDownloads: Record<string, number>
): ChartDatum[] {
  // aggregate the individual download counts for each version into sums of each major version.
  const majorVersionDownloads = new Map<number, number>();
  for (const [version, downloads] of Object.entries(versionsDownloads)) {
    const majorVersion = semverMajor(version);

    const currentDownloadCount = majorVersionDownloads.get(majorVersion) ?? 0;
    majorVersionDownloads.set(majorVersion, currentDownloadCount + downloads);
  }

  return (
    Array.from(majorVersionDownloads.entries())
      .map(([version, downloads]) => ({
        versionRange: majorVersionRange(version),
        version: `${version}.0.0`,
        downloads,
      }))
      // the data needs to be sorted for the XYChart component to render it in the correct order
      .sort(reverseCompare(compareField("version", compareLooseSemver)))
  );
}
