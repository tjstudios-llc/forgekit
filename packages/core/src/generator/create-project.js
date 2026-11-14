import fs from "node:fs/promises";
import path from "node:path";
import { getTemplate } from "../templates/registry.js";
import { renderValue } from "./render.js";
import { provisionDatabase } from "../database/postgres.js";
import { installDependencies } from "./install.js";

export async function createProject(options) {
  const template = getTemplate(options.template);
  const parentDir = path.resolve(options.path || process.cwd());
  const targetDir = path.resolve(parentDir, options.name);
  if (targetDir === parentDir || !targetDir.startsWith(parentDir + path.sep)) throw new Error("Project target must be inside the selected parent directory.");
  try { await fs.access(targetDir); throw new Error(`Target already exists: ${targetDir}`); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  const title = options.name.replace(/[-_]/g," ").replace(/\b\w/g,(c)=>c.toUpperCase());
  await fs.mkdir(targetDir,{recursive:false});
  try {
    for (const [relativePath,rawValue] of Object.entries(template.files)) {
      const absolutePath=path.resolve(targetDir,relativePath);
      if (!absolutePath.startsWith(targetDir+path.sep)) throw new Error(`Unsafe template path: ${relativePath}`);
      await fs.mkdir(path.dirname(absolutePath),{recursive:true});
      const rendered=renderValue(rawValue,{name:options.name,title});
      const content=typeof rendered==="string"?rendered:`${JSON.stringify(rendered,null,2)}\\n`;
      await fs.writeFile(absolutePath,content,{mode:relativePath===".env"?0o600:0o644,flag:"wx"});
    }
    await fs.writeFile(path.join(targetDir,".gitignore"),"node_modules/\\n.env\\n.env.*\\n!.env.example\\n.next/\\ndist/\\n",{flag:"wx"});
    let databaseResult={created:false,reason:"Database provisioning not requested."};
    if(options.database==="postgres"){
      databaseResult=options.adminUrl
        ? await provisionDatabase({adminUrl:options.adminUrl,databaseName:options.dbName})
        : {created:false,reason:"No PostgreSQL admin URL supplied; configure DATABASE_URL manually."};
      const dbUrl=(options.databaseUrl||"postgresql://USER:PASSWORD@localhost:5432/DATABASE").replaceAll('"',"");
      await fs.writeFile(path.join(targetDir,".env"),`DATABASE_URL="${dbUrl}"\\n`,{mode:0o600,flag:"wx"});
    }
    const installResult=options.install?await installDependencies(targetDir,options.packageManager):{installed:false,reason:"Dependency installation skipped."};
    return {targetDir,template:template.title,databaseResult,installResult};
  } catch(error) { await fs.rm(targetDir,{recursive:true,force:true}); throw error; }
}
