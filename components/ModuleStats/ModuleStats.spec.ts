import { createVersionGroups } from "./ModuleStats";
import { computeYAxis } from "./VersionDownloadsBarChart";

describe("groupByMajorVersion", () => {
  it("should group into 3 major version buckets", () => {
    const actual = createVersionGroups("major", {
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

    expect(actual).toMatchInlineSnapshot(`
      Map {
        "1.X" => Object {
          "items": Array [
            Object {
              "downloads": 10,
              "version": "1.0.0",
            },
            Object {
              "downloads": 10,
              "version": "1.1.1",
            },
            Object {
              "downloads": 10,
              "version": "1.2.3",
            },
          ],
          "version": "1.0.0",
        },
        "2.X" => Object {
          "items": Array [
            Object {
              "downloads": 5,
              "version": "2.0.1",
            },
            Object {
              "downloads": 5,
              "version": "2.0.3",
            },
            Object {
              "downloads": 5,
              "version": "2.111.2",
            },
          ],
          "version": "2.0.0",
        },
        "3.X" => Object {
          "items": Array [
            Object {
              "downloads": 7,
              "version": "3.0.1-rc.1",
            },
            Object {
              "downloads": 7,
              "version": "3.2.3-beta.1",
            },
            Object {
              "downloads": 7,
              "version": "3.4.0",
            },
          ],
          "version": "3.0.0",
        },
      }
    `);
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

  it("should return compact notation", () => {
    const { ticks, tickFormat } = computeYAxis(1800);

    expect(ticks.map(tickFormat)).toStrictEqual(["0", "1K", "2K"]);
  });
});
