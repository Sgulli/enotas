import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PlopTypes } from "@turbo/gen";

/**
 * Directory containing this config (`turbo/generators/`).
 * Turbo may execute the config as either ESM or CJS; support both.
 */
function getGeneratorsDir(): string {
  try {
    if (import.meta?.url) {
      return path.dirname(fileURLToPath(import.meta.url));
    }
  } catch {
    /* import.meta.url missing in some CJS bundles */
    console.error(
      "import.meta.url missing in some CJS bundles, using process.cwd()",
    );
  }
  if (typeof __dirname !== "undefined") {
    return __dirname;
  }
  return process.cwd();
}

/** `turbo/generators` → monorepo root. */
function getMonorepoRoot(): string {
  return path.resolve(getGeneratorsDir(), "../..");
}

const packageNamePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function validatePackageName(input: string): true | string {
  if (!input) {
    return "Package name is required";
  }
  if (!packageNamePattern.test(input)) {
    return "Use kebab-case (lowercase letters, digits, single hyphens), e.g. core-utils";
  }
  return true;
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setHelper("repoRoot", () => getMonorepoRoot());

  plop.setGenerator("package", {
    description:
      "Scaffold a fast @repo/* library under packages/ (TypeScript, oxlint, turbo tasks)",
    prompts: [
      {
        type: "input",
        name: "name",
        message:
          "Package folder name (kebab-case, creates packages/<name> and @repo/<name>)",
        validate: validatePackageName,
      },
    ],
    actions: [
      ((answers): string => {
        const { name } = answers as { name: string };
        const target = path.join(getMonorepoRoot(), "packages", name);
        if (fs.existsSync(target)) {
          throw new Error(
            `Refusing to overwrite: packages/${name} already exists`,
          );
        }
        // Plop custom actions must return `string | Promise<string>`; empty string = success (not skipped).
        return "";
      }) satisfies PlopTypes.CustomActionFunction,
      {
        type: "add",
        path: "{{repoRoot}}/packages/{{ name }}/package.json",
        templateFile: "templates/package/package.json.hbs",
      },
      {
        type: "add",
        path: "{{repoRoot}}/packages/{{ name }}/tsconfig.json",
        templateFile: "templates/package/tsconfig.json.hbs",
      },
      {
        type: "add",
        path: "{{repoRoot}}/packages/{{ name }}/.oxlintrc.json",
        templateFile: "templates/package/oxlintrc.json.hbs",
      },
      {
        type: "add",
        path: "{{repoRoot}}/packages/{{ name }}/src/index.ts",
        templateFile: "templates/package/index.ts.hbs",
      },
    ],
  });

  plop.setGenerator("example", {
    description:
      "An example Turborepo generator - creates a new file at the root of the project",
    prompts: [
      {
        type: "input",
        name: "file",
        message: "What is the name of the new file to create?",
        validate: (input: string) => {
          if (input.includes(".")) {
            return "file name cannot include an extension";
          }
          if (input.includes(" ")) {
            return "file name cannot include spaces";
          }
          if (!input) {
            return "file name is required";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "type",
        message: "What type of file should be created?",
        choices: [".md", ".txt"],
      },
      {
        type: "input",
        name: "title",
        message: "What should be the title of the new file?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "{{repoRoot}}/{{ dashCase file }}{{ type }}",
        templateFile: "templates/turborepo-generators.hbs",
      },
    ],
  });
}
