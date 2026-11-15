import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createProject as legacyCreateProject, templates as legacyTemplates } from "../../../src/index.js";
import { runCli as legacyRunCli } from "../../../src/cli.js";
import { validateProjectOptions as legacyValidateProjectOptions } from "../../../src/config.js";
import { provisionDatabase as legacyProvisionDatabase } from "../../../src/database/postgres.js";
import { createProject as legacyGeneratorCreateProject } from "../../../src/generator/create-project.js";
import { installDependencies as legacyInstallDependencies } from "../../../src/generator/install.js";
import { renderValue as legacyRenderValue } from "../../../src/generator/render.js";
import { templates as legacyRegistry } from "../../../src/templates/registry.js";
import { expressTemplate as legacyExpressTemplate } from "../../../src/templates/express.js";
import { fastifyTemplate as legacyFastifyTemplate } from "../../../src/templates/fastify.js";
import { fullstackTemplate as legacyFullstackTemplate } from "../../../src/templates/fullstack.js";
import { nextjsTemplate as legacyNextjsTemplate } from "../../../src/templates/nextjs.js";
import { reactViteTemplate as legacyReactViteTemplate } from "../../../src/templates/react-vite.js";
import { createProject, templates } from "../src/index.js";
import { validateProjectOptions } from "../src/config.js";
import { provisionDatabase } from "../src/database/postgres.js";
import { installDependencies } from "../src/generator/install.js";
import { renderValue } from "../src/generator/render.js";

test("legacy root exports delegate to the shared Core and CLI", () => {
  assert.equal(legacyCreateProject, createProject);
  assert.equal(legacyGeneratorCreateProject, createProject);
  assert.equal(legacyTemplates, templates);
  assert.equal(legacyRegistry, templates);
  assert.equal(legacyValidateProjectOptions, validateProjectOptions);
  assert.equal(legacyProvisionDatabase, provisionDatabase);
  assert.equal(legacyInstallDependencies, installDependencies);
  assert.equal(legacyRenderValue, renderValue);
  assert.equal(typeof legacyRunCli, "function");
  assert.equal(legacyExpressTemplate, templates.get("express"));
  assert.equal(legacyFastifyTemplate, templates.get("fastify"));
  assert.equal(legacyFullstackTemplate, templates.get("fullstack"));
  assert.equal(legacyNextjsTemplate, templates.get("nextjs"));
  assert.equal(legacyReactViteTemplate, templates.get("react-vite"));
});

test("shared templates retain the v0.1 starter features", () => {
  assert.equal(templates.get("express").files["package.json"].scripts.test, "node --test");
  assert.match(templates.get("express").files["src/server.js"], /app\.get\('\/api'/);

  assert.equal(templates.get("fastify").files["package.json"].scripts.test, "node --test");
  assert.match(templates.get("fastify").files["src/server.js"], /app\.get\('\/api'/);

  assert.ok(templates.get("nextjs").files["jsconfig.json"]);
  assert.equal(templates.get("nextjs").files["package.json"].scripts.lint, "eslint .");

  assert.match(templates.get("react-vite").files["src/main.jsx"], /style\.css/);
  assert.ok(templates.get("react-vite").files["src/style.css"]);

  assert.equal(templates.get("fullstack").files["package.json"].scripts["db:studio"], "prisma studio");
  assert.ok(templates.get("fullstack").files["app/api/health/route.js"]);
  assert.ok(templates.get("fullstack").files["README.md"]);
});

test("the shared generator renders all five templates", async (t) => {
  const parent = await fs.mkdtemp(path.join(os.tmpdir(), "forgekit-templates-"));
  t.after(() => fs.rm(parent, { recursive: true, force: true }));

  for (const template of templates.values()) {
    const result = await createProject({
      name: `sample-${template.id}`,
      template: template.id,
      path: parent,
      database: "none",
      install: false
    });
    const manifest = JSON.parse(await fs.readFile(path.join(result.targetDir, "package.json"), "utf8"));
    assert.equal(manifest.name, `sample-${template.id}`);
    assert.equal(result.template, template.title);
  }
});
