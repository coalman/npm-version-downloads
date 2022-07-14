import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { ModuleSearch } from ".";

let useRouterSpy: jest.SpyInstance;
beforeEach(() => {
  useRouterSpy = jest.spyOn(require("next/router"), "useRouter");
});
afterEach(() => {
  jest.clearAllMocks();
});

function getInput() {
  return screen.getByPlaceholderText("Find an npm package");
}

function routerMock() {
  const router = { push: jest.fn() };
  useRouterSpy.mockReturnValue(router);
  return {
    router,
    modulePath: (moduleName: string) => ({
      pathname: "/module/[moduleName]",
      query: { moduleName },
    }),
  };
}

it("should focus the input on mount when autoFocus is true", () => {
  render(<ModuleSearch autoFocus />);

  expect(document.activeElement).toBe(getInput());
});

it("should navigate when Search button clicked", async () => {
  const { router, modulePath } = routerMock();
  const user = userEvent.setup();

  render(<ModuleSearch />);

  const input = getInput();

  await user.type(input, "react");
  await user.click(screen.getByText("Search"));

  expect(router.push).toHaveBeenCalledWith(modulePath("react"));
});

it("should navigate on Enter press", async () => {
  const { router, modulePath } = routerMock();
  const user = userEvent.setup();

  render(<ModuleSearch />);

  const input = getInput();

  await user.type(input, "react{enter}");

  expect(router.push).toHaveBeenCalledWith(modulePath("react"));
});
