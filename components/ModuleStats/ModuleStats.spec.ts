import { filterByMajorVersion, groupByMajorVersion } from "./ModuleStats";
import { computeYAxis } from "./VersionDownloadsBarChart";

describe("filterByMajorVersion", () => {
  it("should select data for 1.X", () => {
    const actual = filterByMajorVersion("1.X", {
      "1.0.1": 5,
      "1.0.0": 5,
      "2.0.0": 7,
      "3.0.1": 7,
      "1.0.0-rc.1": 5,
      "1.5.0": 5,
    });

    expect(actual).toStrictEqual(
      ["1.0.1", "1.0.0", "1.0.0-rc.1", "1.5.0"].map((version) => ({
        versionRange: "1.X",
        version,
        downloads: 5,
      }))
    );
  });

  it("should be able to select no data", () => {
    const actual = filterByMajorVersion("4.X", {
      "1.0.1": 5,
      "1.0.0": 5,
      "2.0.0": 7,
      "3.0.1": 7,
      "1.0.0-rc.1": 5,
      "1.5.0": 5,
    });

    expect(actual).toHaveLength(0);
  });

  it("should return no data for empty versionsDownloads", () => {
    const actual = filterByMajorVersion("0.X", {});

    expect(actual).toHaveLength(0);
  });
});

describe("groupByMajorVersion", () => {
  it("should group into 3 major version buckets", () => {
    const actual = groupByMajorVersion({
      "1.0.0": 10,
      "1.1.1": 10,
      "1.2.3": 10,
      "2.0.1": 5,
      "2.0.3": 5,
      "2.111.2": 5,
      "3.0.1-rc.1": 7,
      "3.2.3-beta.1": 7,
      "3.4.0": 7,
    });

    expect(actual).toStrictEqual([
      {
        versionRange: "3.X",
        version: "3.0.0",
        downloads: 21,
      },
      {
        versionRange: "2.X",
        version: "2.0.0",
        downloads: 15,
      },
      {
        versionRange: "1.X",
        version: "1.0.0",
        downloads: 30,
      },
    ]);
  });

  it("should return data sorted by version (descending)", () => {
    const actual = groupByMajorVersion({
      "10.1.2": 5,
      "2.0.1": 3,
      "0.1.0": 2,
      "1.5.1": 1,
      "9.0.1": 10,
      "7.0.0": 5,
    });

    expect(actual.map((a) => a.versionRange)).toStrictEqual([
      "10.X",
      "9.X",
      "7.X",
      "2.X",
      "1.X",
      "0.X",
    ]);
  });
});

describe("computeYAxis", () => {
  it("should return [0, 1] ticks for 0 downloads", () => {
    const actual = computeYAxis(0);

    expect(actual.ticks).toStrictEqual([0, 1]);
    expect(actual.domain).toStrictEqual([0, 1]);
  });

  it("should return [0, 1] ticks for 1 downloads", () => {
    const actual = computeYAxis(1);

    expect(actual.ticks).toStrictEqual([0, 1]);
    expect(actual.domain).toStrictEqual([0, 1]);
  });

  it("should return 11 ticks for 100 downloads", () => {
    const actual = computeYAxis(100);

    expect(actual.ticks).toStrictEqual([
      0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
    ]);
    expect(actual.domain).toStrictEqual([0, 100]);
  });

  it("should return non scientific notation format for 1000 downloads", () => {
    const { domain, tickFormat } = computeYAxis(1000);

    expect(domain.map(tickFormat)).toStrictEqual(["0", "1000"]);
  });

  it("should return scientific notation for 1800 downloads", () => {
    const { ticks, tickFormat } = computeYAxis(1800);

    expect(ticks.map(tickFormat)).toStrictEqual(["0", "1e3", "2e3"]);
  });
});
