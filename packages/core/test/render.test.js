import test from "node:test";
import assert from "node:assert/strict";
import { renderValue } from "../src/generator/render.js";

test("renders nested template values",()=>{
 const result=renderValue({name:"{{name}}",files:["Hello {{title}}"]},{name:"demo",title:"Demo"});
 assert.deepEqual(result,{name:"demo",files:["Hello Demo"]});
});
