import { type FC, type ReactElement } from "react";
import Logo from "../Logo/Logo";
import styles from "./Layout.module.css";
import { ModuleSearch } from "../ModuleSearch/ModuleSearch";

const Layout: FC<{
  hideLogo?: boolean;
  hideModuleSearch?: boolean;
  children?: ReactElement;
}> = (props) => {
  return (
    <div className={styles.layout}>
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
  <header className={styles.header}>
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

const Footer: FC = () => <footer className={styles.footer}></footer>;
