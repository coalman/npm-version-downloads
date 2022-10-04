import { type AriaAttributes } from "react";
import Triangle from "../Triangle";

export type HeaderSort = AriaAttributes["aria-sort"];

export const SortableHeader = (props: {
  sort: HeaderSort;
  onClick: () => void;
  children?: string;
}) => {
  return (
    <th aria-sort={props.sort} className="p-0">
      <button
        type="button"
        className="w-48 min-w-full px-2 flex gap-2 items-center box-border border border-solid border-transparent hover:border-slate-400"
        onClick={props.onClick}
      >
        {props.children}
        {props.sort === "none" || props.sort === undefined ? null : (
          <Triangle dir={props.sort === "ascending" ? "up" : "down"} />
        )}
      </button>
    </th>
  );
};

export interface SortedHeader<F extends string> {
  field: F;
  sort: Exclude<HeaderSort, "none" | "other" | undefined>;
}

export const toggleSortedHeader =
  <F extends string>(field: F) =>
  (prevState: SortedHeader<F>): SortedHeader<F> => {
    if (prevState.field !== field) {
      return { field, sort: "ascending" };
    } else {
      const sort = prevState.sort === "ascending" ? "descending" : "ascending";
      return { field, sort };
    }
  };
