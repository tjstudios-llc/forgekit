import test from "node:test";
import assert from "node:assert/strict";
import { renderValue } from "../src/generator/render.js";

test("template variables render recursively", () => {
  assert.deepEqual(renderValue({ title: "{{title}}", nested: ["{{name}}"] }, { title: "Hello App", name: "hello-app" }), {
    title: "Hello App", nested: ["hello-app"]
  });
});
