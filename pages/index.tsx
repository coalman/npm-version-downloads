import { Fragment, type ReactElement } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import styles from "styles/Home.module.css";
import { ModuleSearch } from "components/ModuleSearch/ModuleSearch";
import Logo from "components/Logo/Logo";
import Layout from "components/Layout/Layout";

const Home: NextPage = () => (
  <Fragment>
    <Head>
      <title>npm version downloads</title>
      <meta name="description" content="npm download count by version." />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className={styles.queryContainer}>
      <header className={styles.header}>
        <h1>
          <Logo />
        </h1>
        <p>
          Compare weekly download counts of version ranges for an npm package.
        </p>
      </header>
      <ModuleSearch autoFocus />
    </main>
  </Fragment>
);

(Home as any).getLayout = (page: ReactElement) => {
  return (
    <Layout hideLogo hideModuleSearch>
      {page}
    </Layout>
  );
};

export default Home;
