import { rest } from "msw";
import { type ModuleStats } from "pages/api/module/[module]/stats";

const u = (path: string) => new URL(path, "http://localhost:8080/").href;

export const handlers = [
  rest.get(u("/api/module/:moduleName/stats"), (req, res, ctx) => {
    const { moduleName } = req.params;
    if (typeof moduleName !== "string") {
      return res(ctx.status(500), ctx.json({}));
    }

    const data = moduleData[moduleName];
    if (data) {
      return res(
        ctx.status(200),
        ctx.json({
          ...data,
          name: moduleName,
        })
      );
    } else {
      return res(ctx.status(500), ctx.json({}));
    }
  }),
];

const moduleData: Record<string, Omit<ModuleStats, "name"> | undefined> = {
  react: {
    versionsDownloads: {},
    deprecations: [],
  },
};
