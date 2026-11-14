import path from "node:path";
import { Command } from "commander";
import { input, select, confirm, password } from "@inquirer/prompts";
import { createProject } from "./generator/create-project.js";
import { templates } from "./templates/registry.js";
import { validateProjectOptions } from "./config.js";

export async function runCli(argv = process.argv) {
  const program = new Command();
  program
    .name("forgekit")
    .description("Generate ready-to-develop applications from reusable templates.")
    .version("0.1.0");

  program.command("templates")
    .description("List available application templates")
    .action(() => {
      for (const item of templates.values()) console.log(`${item.id.padEnd(12)} ${item.description}`);
    });

  program.command("create")
    .description("Create a new application")
    .argument("[name]", "project folder and package name")
    .option("-t, --template <template>", "template ID")
    .option("-p, --path <directory>", "parent directory", process.cwd())
    .option("-d, --database <mode>", "none or postgres")
    .option("--db-name <name>", "PostgreSQL database name")
    .option("--admin-url <url>", "PostgreSQL provisioning connection string")
    .option("--database-url <url>", "Application database connection string (least-privilege app role)")
    .option("--package-manager <manager>", "npm, pnpm, yarn, or bun", "npm")
    .option("--no-install", "skip dependency installation")
    .option("--yes", "accept defaults where possible")
    .action(async (name, opts) => {
      const projectName = name || await input({ message: "Project name", validate: (v) => v.trim().length > 0 || "Project name is required." });
      const template = opts.template || await select({
        message: "Choose a starter template",
        choices: [...templates.values()].map((item) => ({ name: `${item.title} — ${item.description}`, value: item.id }))
      });
      const database = opts.database || (opts.yes
        ? "none"
        : await select({ message: "Database", choices: [{ name: "No database", value: "none" }, { name: "PostgreSQL", value: "postgres" }] }));

      let adminUrl = opts.adminUrl || process.env.FORGEKIT_POSTGRES_ADMIN_URL || "";
      let databaseUrl = opts.databaseUrl || process.env.FORGEKIT_POSTGRES_APP_URL || "";
      if (database === "postgres" && !adminUrl && !opts.yes) {
        const wantsProvision = await confirm({ message: "Do you want ForgeKit to create the PostgreSQL database now?", default: false });
        if (wantsProvision) adminUrl = await password({ message: "PostgreSQL provisioning connection URL", mask: "*", validate: (v) => v.startsWith("postgres") || "Enter a PostgreSQL connection URL." });
      }
      if (database === "postgres" && !databaseUrl && !opts.yes) {
        databaseUrl = await password({ message: "Application database URL (optional; press Enter to use a placeholder)", mask: "*" });
      }
      const dbName = opts.dbName || projectName.replace(/-/g, "_");
      const config = validateProjectOptions({
        name: projectName,
        template,
        path: path.resolve(opts.path),
        database,
        dbName,
        adminUrl,
        databaseUrl,
        install: opts.install,
        packageManager: opts.packageManager
      });

      console.log(`\nCreating ${config.name}...`);
      const result = await createProject(config);
      console.log("\n✓ Project created");
      console.log(`  Location: ${result.targetDir}`);
      console.log(`  Template: ${result.template}`);
      if (result.databaseResult.created) console.log(`  PostgreSQL: created database "${result.databaseResult.databaseName}"`);
      else if (database === "postgres") console.log(`  PostgreSQL: ${result.databaseResult.reason || "Database already exists; not recreated."}`);
      if (result.installResult.installed) console.log(`  Dependencies: installed with ${result.installResult.packageManager}`);
      else console.log(`  Dependencies: ${result.installResult.reason}`);
      console.log("\nNext steps:");
      console.log(`  cd "${result.targetDir}"`);
      if (!result.installResult.installed) console.log(`  ${config.packageManager} install`);
      console.log("  npm run dev (where supported)");
    });

  await program.parseAsync(argv);
}
