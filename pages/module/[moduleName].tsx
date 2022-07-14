import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { useModuleQuery } from "lib/useModuleQuery";
import { ModuleStats } from "components/ModuleStats";
import LoadingSpinner from "components/LoadingSpinner";

const ModuleStatsPage: NextPage = () => {
  const moduleName = useRouter().query.moduleName as string | undefined;

  const moduleQuery = useModuleQuery(moduleName);

  // "/" is replaced with "$$" for the rest api call
  const moduleDisplayName = moduleName?.replace("$$", "/");

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
      <main className="px-16 py-12 flex flex-col items-center gap-8">
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
