import { type AriaAttributes } from "react";
import styles from "./VersionTable.module.css";
import Triangle from "../Triangle/Triangle";

export type HeaderSort = AriaAttributes["aria-sort"];

export const SortableHeader = (props: {
  sort: HeaderSort;
  onClick: () => void;
  children?: string;
}) => {
  return (
    <th aria-sort={props.sort}>
      <button
        type="button"
        className={styles.headerButton}
        onClick={props.onClick}
      >
        {props.children}
        {props.sort === "none" ? null : (
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
