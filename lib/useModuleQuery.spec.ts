import { fetchModuleStats } from "./useModuleQuery";

describe("fetchModuleStats", () => {
  it("should return error for unfound module", async () => {
    await expect(() =>
      fetchModuleStats("unfound")
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"(500) Internal Server Error"`
    );
  });
});
