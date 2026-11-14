import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import fs from "node:fs/promises";
import path from "node:path";
import { createProject } from "../src/generator/create-project.js";

test("creates a local project and does not overwrite an existing target",async(t)=>{
 const parent=await fs.mkdtemp(path.join(os.tmpdir(),"forgekit-test-"));
 t.after(()=>fs.rm(parent,{recursive:true,force:true}));
 const result=await createProject({name:"sample-app",template:"express",path:parent,database:"none",install:false});
 assert.equal(result.template,"Express API");
 const server=await fs.readFile(path.join(result.targetDir,"src/server.js"),"utf8");
 assert.match(server,/sample-app/);
 assert.match(server, /\n/);
 await assert.rejects(()=>createProject({name:"sample-app",template:"express",path:parent,database:"none"}),/already exists/);
});
