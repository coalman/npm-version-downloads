import { Fragment, type ReactElement } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { ModuleSearch } from "components/ModuleSearch";
import Logo from "components/Logo";
import Layout from "components/Layout";

const Home: NextPage = () => (
  <Fragment>
    <Head>
      <title>npm version downloads</title>
      <meta name="description" content="npm download count by version." />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className="flex flex-col justify-center items-center gap-10">
      <header className="text-center">
        <h1 className="text-2xl font-bold pb-4">
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
