/**
 * Jest config options. This config gets mutated by createJestConfig.
 */
const preNextConfig = {
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js",
    "<rootDir>/lib/mocks/jestSetup.ts",
  ],
  testEnvironment: "jest-environment-jsdom",
  collectCoverageFrom: [
    ...["components", "lib", "pages"].map((dir) => `${dir}/**/*.{ts,tsx}`),
    // these files are meant for usage in a browser to set up msw.
    "!lib/mocks/api/{browser,index}.ts",
  ],
  coverageProvider: "v8",
  //coverageReporters: ["html", "text-summary"],
};

const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: ".",
});

module.exports = async () => {
  const config = await createJestConfig(preNextConfig)();
  // transform node_modules for ESM support (remove it from the ignore patterns)
  config.transformIgnorePatterns = config.transformIgnorePatterns.filter(
    (ignorePattern) => !ignorePattern.includes("/node_modules/")
  );
  // add baseUrl directories to moduleNameMapper to emulate built-in nextjs behavior.
  config.moduleNameMapper = {
    ...config.moduleNameMapper,
    ...(await moduleNameMapperForBaseUrl("./")),
  };
  return config;
};

/**
 * Creates jest config moduleNameMapper entries for a tsconfig baseUrl.
 *
 * This emulates built-in baseUrl behavior in nextjs.
 *
 * @param baseUrl {string}
 * @returns {Record<string, string | string[]>}
 *
 * @see https://nextjs.org/docs/advanced-features/module-path-aliases
 * @see https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring
 * @see https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping/
 */
async function moduleNameMapperForBaseUrl(baseUrl) {
  const fs = require("fs/promises");
  const baseUrlEntries = await fs.readdir(baseUrl, {
    withFileTypes: true,
    encoding: "utf-8",
  });

  const moduleNameMapper = {};
  for (const dirEntry of baseUrlEntries) {
    if (
      dirEntry.isDirectory() &&
      !dirEntry.name.startsWith(".") &&
      dirEntry.name !== "node_modules"
    ) {
      // NOTE: I think this assumes the jest rootDir and tsconfig baseUrl are the same directory?
      moduleNameMapper[
        `^${dirEntry.name}/(.*)$`
      ] = `<rootDir>/${dirEntry.name}/$1`;
    }
  }
  return moduleNameMapper;
}
