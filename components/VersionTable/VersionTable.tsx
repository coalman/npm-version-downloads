import { type FC, useMemo, useState } from "react";
import { compareNumber, FieldComparatorMap, reverseCompare } from "lib/sort";
import {
  SortableHeader,
  toggleSortedHeader,
  type SortedHeader,
} from "./SortableHeader";
import { compareLooseSemver } from "components/ModuleStats/ChartData";

export interface VersionTableDatum {
  version: string;
  downloads: number;
}

const fieldComparators = new FieldComparatorMap<VersionTableDatum>({
  version: compareLooseSemver,
  downloads: compareNumber,
});

type VersionTableHeader = SortedHeader<keyof VersionTableDatum>;

const numberFormatter = new Intl.NumberFormat();

export interface VersionTableProps {
  /**
   * Displayed in the caption of the table.
   *
   * This should be things like "react" or "16.X" depending on what is selected.
   */
  selectionName: string;
  data: readonly VersionTableDatum[];
}

export const VersionTable: FC<VersionTableProps> = (props) => {
  const [sortedHeader, setSortedHeader] = useState<VersionTableHeader>({
    field: "version",
    sort: "descending",
  });

  const sortedData = useMemo(() => {
    let compare = fieldComparators.get(sortedHeader.field);
    if (sortedHeader.sort === "descending") {
      compare = reverseCompare(compare);
    }
    return Array.from(props.data).sort(compare);
  }, [sortedHeader, props.data]);

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
