import { type FC, type ReactElement } from "react";
import Logo from "./Logo";
import { ModuleSearch } from "./ModuleSearch";

const Layout: FC<{
  hideLogo?: boolean;
  hideModuleSearch?: boolean;
  children?: ReactElement;
}> = (props) => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      <Header
        hideLogo={props.hideLogo}
        hideModuleSearch={props.hideModuleSearch}
      />
      {props.children}
      <Footer />
    </div>
  );
};

export default Layout;

const Header: FC<{
  hideLogo: boolean | undefined;
  hideModuleSearch: boolean | undefined;
}> = (props) => (
  <header className="px-6 sm:px-12 py-4 flex justify-between text-slate-50 bg-slate-800">
    <section>{!props.hideLogo && <Logo link />}</section>
    {!props.hideModuleSearch && <ModuleSearch />}
    <section>
      <a
        href="https://github.com/coalman/npm-version-downloads"
        aria-label="Github repository link."
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <use href="/github.svg#icon" />
        </svg>
      </a>
    </section>
  </header>
);

const Footer: FC = () => (
  <footer className="h-12 text-slate-50 bg-slate-800"></footer>
);
