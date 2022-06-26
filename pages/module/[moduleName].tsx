import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { useModuleQuery } from "lib/useModuleQuery";
import styles from "components/ModuleStats/ModuleStats.module.css";
import ModuleStats from "components/ModuleStats/ModuleStats";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";

const ModuleStatsPage: NextPage = () => {
  const moduleName = useRouter().query.moduleName as string;

  const moduleQuery = useModuleQuery(moduleName);

  // "/" is replaced with "$$" for the rest api call
  const moduleDisplayName = moduleName.replace("$$", "/");

  return (
    <Fragment>
      <Head>
        <title>{moduleDisplayName}</title>
        <meta
          name="description"
          content={`Download stats for ${moduleDisplayName}`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {moduleQuery.state !== "completed" ? null : (
          <ModuleStats
            moduleName={moduleDisplayName}
            versionsDownloads={moduleQuery.data.versionsDownloads}
          />
        )}
        {moduleQuery.state !== "pending" ? null : <LoadingSpinner />}
        {moduleQuery.state !== "error" ? null : <p>{moduleQuery.reason}</p>}
      </main>
    </Fragment>
  );
};

export default ModuleStatsPage;
