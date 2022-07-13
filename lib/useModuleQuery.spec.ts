import { fetchModuleStats } from "./useModuleQuery";

describe("fetchModuleStats", () => {
  it("should return error for unfound module", async () => {
    await expect(() =>
      fetchModuleStats("unfound")
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"(500) Internal Server Error"`
    );
  });

  it("should return undefined for aborted fetch", async () => {
    const abortController = new AbortController();

    const fetchRequest = fetchModuleStats(
      "f-major-versions",
      abortController.signal
    );
    abortController.abort();

    await expect(fetchRequest).resolves.toBe(undefined);
  });

  it("should return data for f-major-versions (mock)", async () => {
    await expect(fetchModuleStats("f-major-versions")).resolves
      .toMatchInlineSnapshot(`
            Object {
              "deprecations": Array [],
              "name": "f-major-versions",
              "versionsDownloads": Object {
                "1.0.0": 50,
                "2.0.0": 100,
                "3.0.0": 200,
                "4.0.0": 1000,
              },
            }
          `);
  });
});
