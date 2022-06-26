import type { NextApiRequest, NextApiResponse } from "next";
// @ts-ignore
import validate from "validate-npm-package-name";

export interface ModuleStats {
  name: string;
  versionsDownloads: Record<string, number>;
  deprecations: string[];
}

type Data = { error: string } | ModuleStats;

const contextPattern =
  /<script integrity=".+?">window.__context__ = (.*?)<\/script>/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> {
  let moduleName = req.query.module as string;
  // handle scoped packages
  moduleName = moduleName?.replace("$$", "/");

  const result = await fetch(`https://www.npmjs.com/package/${moduleName}`);
  if (!result.ok) {
    res.status(500).json({ error: "failed to load module page" });
    return;
  }
  const htmlResult = await result.text();

  const contextData = contextPattern.exec(htmlResult);
  if (contextData === null) {
    res.status(500).json({ error: "failed to find context data" });
    return;
  }
  const { name, context } = JSON.parse(contextData[1]);

  if (name === "package/package") {
    res.status(200).setHeader("cache-control", "public, max-age=3600").json({
      name: context.package,
      versionsDownloads: context.versionsDownloads,
      deprecations: context.packument.deprecations,
    });
  } else if (name === "errors/not-found") {
    // wait until after the not-found response to validate the module name, in
    // case the rules have changed and our validation module is out of date.
    const validation = validate(moduleName);

    if (!validation.validForNewPackages && !validation.validForOldPackages) {
      // the package doesn't exist because it's probably an invalid name.
      res
        .status(400)
        .setHeader("cache-control", "public, max-age=3600")
        .json({
          error: validation.errors.join("\n"),
        });
    } else {
      // package doesn't exist
      res.status(404).setHeader("cache-control", "public, max-age=3600").json({
        error: context.message,
      });
    }
  } else if (name === "auth/login") {
    // this is probably a private (scoped?) package
    res.status(404).setHeader("cache-control", "public, max-age=3600").json({
      error: context.message,
    });
  } else if (name.startsWith("errors/")) {
    res.status(500).setHeader("cache-control", "public, max-age=60").json({
      error: context.message,
    });
  } else {
    res
      .status(500)
      .setHeader("cache-control", "public, max-age=60")
      .json({
        error: `Unknown response: ${name}`,
      });
  }
}
