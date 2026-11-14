import test from "node:test";
import assert from "node:assert/strict";
import { validateProjectOptions, validateDatabaseName } from "../src/config.js";

test("valid project configuration is accepted", () => {
  const result = validateProjectOptions({ name: "sample-app", template: "express", path: "/tmp", database: "none" });
  assert.equal(result.name, "sample-app");
  assert.equal(result.dbName, "sample_app");
});

test("unsafe project names are rejected", () => {
  assert.throws(() => validateProjectOptions({ name: "../oops", template: "express", path: "/tmp" }));
});

test("unsafe PostgreSQL identifiers are rejected", () => {
  assert.throws(() => validateDatabaseName("bad-name; DROP DATABASE postgres"));
});
