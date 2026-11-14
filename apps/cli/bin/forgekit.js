#!/usr/bin/env node
import { runCli } from "../src/cli.js";
runCli().catch((error)=>{console.error(`\\nForgeKit: ${error.message}`);process.exitCode=1;});
