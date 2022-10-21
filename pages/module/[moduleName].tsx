import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { useModuleQuery } from "lib/useModuleQuery";
import { ModuleStats } from "components/ModuleStats";
import LoadingSpinner from "components/LoadingSpinner";
import { decodeModuleName } from "lib/moduleName";
import clsx from "clsx";

const ModuleStatsPage: NextPage = () => {
  const moduleName = useRouter().query.moduleName as string | undefined;

  const moduleQuery = useModuleQuery(moduleName);

  const moduleDisplayName = moduleName && decodeModuleName(moduleName);

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
      <main
        className={clsx(
          "py-4 flex flex-col items-center gap-8",
          "md:px-16 md:py-12"
        )}
      >
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
