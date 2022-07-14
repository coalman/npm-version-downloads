import { type FC, useMemo, useState } from "react";
import {
  type ChartDatum,
  compareVersion,
  compareDownloads,
} from "lib/ChartDatum";
import { reverseCompare } from "lib/sort";
import {
  SortableHeader,
  toggleSortedHeader,
  type SortedHeader,
} from "./SortableHeader";

const numberFormatter = new Intl.NumberFormat();

export interface VersionTableDatum {
  version: string;
  downloads: number;
}

export interface VersionTableProps {
  /**
   * Displayed in the caption of the table.
   *
   * This should be things like "react" or "16.X" depending on what is selected.
   */
  selectionName: string;
  data: readonly ChartDatum[];
}

export const VersionTable: FC<VersionTableProps> = (props) => {
  const [sortedHeader, setSortedHeader] = useState<VersionTableHeader>({
    field: "version",
    sort: "descending",
  });

  const sortedData = useMemo(
    () => sortChartDatumByHeader(sortedHeader, props.data),
    [sortedHeader, props.data]
  );

  const getHeaderProps = (field: VersionTableHeader["field"]) => ({
    field,
    sort: sortedHeader?.field === field ? sortedHeader.sort : undefined,
    onClick: () => setSortedHeader(toggleSortedHeader(field)),
  });

  return (
    <table className="table-fixed border-collapse">
      <caption>
        Weekly downloads for {props.selectionName}
        <span className="sr-only">
          , column headers with buttons are sortable.
        </span>
      </caption>
      <thead>
        <tr>
          <SortableHeader {...getHeaderProps("version")}>
            Version
          </SortableHeader>
          <SortableHeader {...getHeaderProps("downloads")}>
            Downloads
          </SortableHeader>
        </tr>
      </thead>
      <tbody>
        {sortedData.map(({ version, downloads }) => (
          <tr key={version} className="odd:bg-slate-300">
            <td className="px-2 py-1" data-testid="version-cell">
              {version}
            </td>
            <td className="px-2 py-1 text-right">
              <code>{numberFormatter.format(downloads)}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const fieldComparisons = {
  version: compareVersion,
  downloads: compareDownloads,
} as const;

type VersionTableHeader = SortedHeader<keyof typeof fieldComparisons>;

function sortChartDatumByHeader(
  state: VersionTableHeader,
  data: readonly ChartDatum[]
): ChartDatum[] {
  let compare = fieldComparisons[state.field];
  if (state.sort === "descending") {
    compare = reverseCompare(compare);
  }
  return Array.from(data).sort(compare);
}
