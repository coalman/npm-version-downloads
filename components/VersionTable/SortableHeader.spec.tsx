import { toggleSortedHeader } from "./SortableHeader";

describe("toggleSortedHeader", () => {
  type Field = "new" | "old";

  it("should toggle new field to ascending by default", () => {
    let actual = toggleSortedHeader<Field>("old")({
      field: "new",
      sort: "descending",
    });
    actual = toggleSortedHeader<Field>("new")(actual);

    expect(actual).toStrictEqual({ field: "new", sort: "ascending" });
  });

  it("should toggle ascending to descending", () => {
    const actual = toggleSortedHeader<Field>("new")({
      field: "new",
      sort: "ascending",
    });

    expect(actual).toStrictEqual({ field: "new", sort: "descending" });
  });

  it("should toggle descending to ascending", () => {
    const actual = toggleSortedHeader<Field>("new")({
      field: "new",
      sort: "descending",
    });

    expect(actual).toStrictEqual({ field: "new", sort: "ascending" });
  });
});
