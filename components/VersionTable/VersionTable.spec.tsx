import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { VersionTable } from "./VersionTable";
import { type ChartDatum } from "lib/ChartDatum";

const defaultData: readonly ChartDatum[] = [
  { version: "1.0.0", versionRange: "1.X", downloads: 300 },
  { version: "2.0.0", versionRange: "2.X", downloads: 200 },
  { version: "3.0.0", versionRange: "3.X", downloads: 100 },
];

function getVersionCells() {
  const cells = screen.getAllByTestId("version-cell");
  return cells.map((c) => c.innerHTML);
}

it("should sort version (descending) by default", () => {
  render(<VersionTable selectionName="react" data={defaultData} />);

  const cells = getVersionCells();
  expect(cells).toStrictEqual(["3.0.0", "2.0.0", "1.0.0"]);
});

it("should toggle version sort on version header click", async () => {
  const user = userEvent.setup();

  render(<VersionTable selectionName="react" data={defaultData} />);

  const versionHeader = screen.getByText("Version");
  await user.click(versionHeader);

  const cells = getVersionCells();
  // should be sorted in ascending order of versions
  expect(cells).toStrictEqual(["1.0.0", "2.0.0", "3.0.0"]);
});

it("should toggle downloads sort on downloads header click", async () => {
  const user = userEvent.setup();

  render(<VersionTable selectionName="react" data={defaultData} />);

  const downloadHeader = screen.getByText("Downloads");
  await user.click(downloadHeader);

  const cells = getVersionCells();
  // should be sorted in ascending order of downloads
  expect(cells).toStrictEqual(["3.0.0", "2.0.0", "1.0.0"]);
});
