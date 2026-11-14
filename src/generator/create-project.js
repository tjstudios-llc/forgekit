import fs from "node:fs/promises";
import path from "node:path";
import { getTemplate } from "../templates/registry.js";
import { renderValue } from "./render.js";
import { provisionDatabase } from "../database/postgres.js";
import { installDependencies } from "./install.js";

export async function createProject(options, hooks = {}) {
  const template = getTemplate(options.template);
  const targetDir = path.resolve(options.path, options.name);

  try {
    await fs.access(targetDir);
    throw new Error(`Target already exists: ${targetDir}. Choose another name or location.`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const vars = { name: options.name, title: options.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) };
  await fs.mkdir(targetDir, { recursive: false });

  try {
    for (const [relativePath, rawValue] of Object.entries(template.files)) {
      const absolutePath = path.resolve(targetDir, relativePath);
      if (!absolutePath.startsWith(`${targetDir}${path.sep}`)) throw new Error(`Unsafe template path: ${relativePath}`);
      await fs.mkdir(path.dirname(absolutePath), { recursive: true });
      const rendered = renderValue(rawValue, vars);
      const content = typeof rendered === "string" ? rendered : `${JSON.stringify(rendered, null, 2)}\n`;
      await fs.writeFile(absolutePath, content, { mode: relativePath === ".env" ? 0o600 : 0o644 });
    }

    await fs.writeFile(path.join(targetDir, ".gitignore"), "node_modules/\n.env\n.env.*\n!.env.example\n.next/\ndist/\n", { flag: "w" });
    let databaseResult = { created: false, reason: "Database provisioning not requested." };

    if (options.database === "postgres") {
      if (options.adminUrl) {
        databaseResult = await provisionDatabase({
          adminUrl: options.adminUrl,
          databaseName: options.dbName
        });
        await writeEnv(targetDir, options.databaseUrl, options.dbName);
      } else {
        databaseResult = { created: false, reason: "No PostgreSQL admin URL supplied; configure DATABASE_URL manually." };
        await writeEnv(targetDir, options.databaseUrl, options.dbName);
      }
    }

    let installResult = { installed: false, reason: "Dependency installation skipped." };
    if (options.install) installResult = await installDependencies(targetDir, options.packageManager);

    return { targetDir, template: template.title, databaseResult, installResult };
  } catch (error) {
    await fs.rm(targetDir, { recursive: true, force: true });
    throw error;
  }
}

async function writeEnv(targetDir, databaseUrl) {
  const value = databaseUrl || "postgresql://USER:PASSWORD@localhost:5432/DATABASE";
  await fs.writeFile(path.join(targetDir, ".env"), `DATABASE_URL="${value}"\n`, { mode: 0o600 });
}

function buildAppDatabaseUrl(adminUrl, databaseName) {
  const url = new URL(adminUrl);
  url.pathname = `/${databaseName}`;
  return url.toString();
}
