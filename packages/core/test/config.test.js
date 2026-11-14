import test from "node:test";
import assert from "node:assert/strict";
import { validateProjectOptions, validateDatabaseName } from "../src/config.js";

test("validates a project configuration and defaults",()=>{
 const config=validateProjectOptions({name:"hello-world",template:"express"});
 assert.equal(config.database,"none");
 assert.equal(config.dbName,"hello_world");
 assert.equal(config.packageManager,"npm");
});
test("rejects unsafe project names and unknown templates",()=>{
 assert.throws(()=>validateProjectOptions({name:"../escape",template:"express"}));
 assert.throws(()=>validateProjectOptions({name:"valid",template:"unknown"}));
});
test("validates PostgreSQL database identifiers",()=>{
 assert.equal(validateDatabaseName("app_db"),"app_db");
 assert.throws(()=>validateDatabaseName("bad-name"));
});
