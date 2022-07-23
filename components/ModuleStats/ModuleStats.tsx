import { type FC, Fragment, useMemo, useState } from "react";
import semverParse from "semver/functions/parse";
import { reverseCompare } from "lib/sort";
import { compareVersion, type ChartDatum } from "lib/ChartDatum";
import { VersionTable } from "../VersionTable";
import VersionDownloadsBarChart from "./VersionDownloadsBarChart";

const accessors = {
  xAccessor: (d: ChartDatum) => d.versionRange,
  yAccessor: (d: ChartDatum) => d.downloads,
} as const;

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

  const yAxis = useMemo(() => {
    const largestDownloadCount = chartData.reduce(
      (max, { downloads }) => Math.max(max, downloads),
      0
    );
    return computeYAxis(largestDownloadCount);
  }, [chartData]);

  return (
    <Fragment>
      <h1 className="font-bold text-2xl">
        <a
          href="#"
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
          {...accessors}
          yDomain={yAxis.domain}
          yTicks={yAxis.ticks}
          yTickFormat={yAxis.tickFormat}
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
      .sort(reverseCompare(compareVersion))
  );
}

export function computeYAxis(largestValue: number) {
  // NOTE: largestValue and step have a minimum value of 1 so that
  // in empty/small cases, we still render a tick at 0 and 1.
  largestValue = Math.max(largestValue, 1);

  // Calculate the largest power of 10 that will span the domain in
  // less than or equal to 10 steps (11 ticks if you count tick at 0).
  //
  // calculate a 1/10th step from 0 to the largestValue (not a power of 10)
  let step = Math.max(1, largestValue / 10);
  // find the closest power of 10 greater than step
  const stepPower = Math.ceil(Math.log10(step));
  step = 10 ** stepPower;

  // +1 tick to account for the first tick starting at 0
  const ticks = Array(1 + Math.ceil(largestValue / step))
    .fill(null) // map skips holes in array, so we need to fill them
    .map((_, i) => i * step);

  const domain: [number, number] = [ticks[0], ticks[ticks.length - 1]];

  let tickFormat = (value: number) => {
    if (value === 0) return "0";
    return `${value / step}e${stepPower}`;
  };
  // only use scientific notation if steps are larger than 100
  if (stepPower <= 2) {
    tickFormat = String;
  }

  return {
    ticks,
    domain,
    tickFormat,
  };
}
