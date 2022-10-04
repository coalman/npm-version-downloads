import { decodeModuleName } from "lib/moduleName";
import { rest } from "msw";
import { type ModuleStats } from "pages/api/module/[module]/stats";

const u = (path: string) => new URL(path, "http://localhost:3000/").href;

export const handlers = [
  rest.get(u("/api/module/:moduleName/stats"), (req, res, ctx) => {
    let { moduleName } = req.params;
    if (typeof moduleName !== "string") {
      return res(ctx.status(500), ctx.json({}));
    }
    moduleName = decodeModuleName(moduleName);

    const data = moduleData[moduleName];
    if (!data) {
      return res(ctx.status(500), ctx.json({}));
    }

    return res(
      ctx.delay(),
      ctx.status(200),
      ctx.json({
        ...data,
        name: moduleName,
      })
    );
  }),
];

function prefixModuleNames<T>(
  prefix: string,
  record: Record<string, T>
): Record<string, T> {
  const newRecord: Record<string, T> = {};
  for (const key of Object.keys(record)) {
    // only add the prefix if it's not a scoped module name
    const newKey = key.startsWith("@") ? key : prefix + key;
    newRecord[newKey] = record[key];
  }
  return newRecord;
}

type ModuleData = Omit<ModuleStats, "name">;
const moduleData: Record<string, ModuleData | undefined> =
  prefixModuleNames<ModuleData>("f-", {
    empty: {
      versionsDownloads: {},
      deprecations: [],
    },
    "one-version": {
      versionsDownloads: {
        "1.0.0": 50,
      },
      deprecations: [],
    },
    "major-versions": {
      versionsDownloads: {
        "1.0.0": 50,
        "2.0.0": 100,
        "3.0.0": 200,
        "4.0.0": 1_000,
      },
      deprecations: [],
    },
    "@scoped/module": {
      versionsDownloads: {
        "1.0.0": 50,
        "2.0.0": 100,
        "3.0.0": 200,
        "4.0.0": 1_000,
      },
      deprecations: [],
    },
    loose: {
      // NOTE: grunt has old version numbers like this. These require loose semver parsing.
      versionsDownloads: {
        "0.4.0a": 50,
        "0.4.0rc2": 100,
      },
      deprecations: [],
    },
  });
