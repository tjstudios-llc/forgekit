import path from "node:path";
import { Command } from "commander";
import { input,select,confirm,password } from "@inquirer/prompts";
import { createProject,templates,validateProjectOptions } from "@forgekit/core";

export async function runCli(argv=process.argv) {
 const program=new Command();
 program.name("forgekit").description("Generate local applications from reusable templates.").version("0.2.0");
 program.command("templates").description("List starter templates").action(()=>{for(const t of templates.values()) console.log(`${t.id.padEnd(12)} ${t.description}`);});
 program.command("doctor").description("Check the local ForgeKit runtime").action(()=>{
  const major=Number(process.versions.node.split(".")[0]);
  console.log(`${major>=22?"✓":"✗"} Node.js v${process.versions.node} (requires 22+)`);
  console.log(process.env.FORGEKIT_POSTGRES_ADMIN_URL?"✓ PostgreSQL provisioning URL configured":"• PostgreSQL provisioning is optional");
 });
 program.command("create").description("Create a local application").argument("[name]")
  .option("-t, --template <template>").option("-p, --path <directory>","parent directory",process.cwd())
  .option("-d, --database <mode>","none or postgres").option("--db-name <name>")
  .option("--admin-url <url>").option("--database-url <url>")
  .option("--package-manager <manager>","npm, pnpm, yarn, or bun","npm")
  .option("--no-install","skip dependency installation").option("--yes","use non-interactive defaults")
  .action(async(name,opts)=>{
   const projectName=name||await input({message:"Project name"});
   const template=opts.template||await select({message:"Choose a template",choices:[...templates.values()].map(t=>({name:`${t.title} — ${t.description}`,value:t.id}))});
   const database=opts.database||(opts.yes?"none":await select({message:"Database",choices:[{name:"None",value:"none"},{name:"PostgreSQL",value:"postgres"}]}));
   let adminUrl=opts.adminUrl||process.env.FORGEKIT_POSTGRES_ADMIN_URL||"";
   let databaseUrl=opts.databaseUrl||process.env.FORGEKIT_POSTGRES_APP_URL||"";
   if(database==="postgres"&&!adminUrl&&!opts.yes&&await confirm({message:"Create the PostgreSQL database now?",default:false})) adminUrl=await password({message:"PostgreSQL provisioning URL",mask:"*"});
   if(database==="postgres"&&!databaseUrl&&!opts.yes) databaseUrl=await password({message:"Application DATABASE_URL (optional)",mask:"*"});
   const config=validateProjectOptions({name:projectName,template,path:path.resolve(opts.path),database,dbName:opts.dbName,adminUrl,databaseUrl,install:opts.install,packageManager:opts.packageManager});
   const result=await createProject(config);
   console.log(`\\nCreated ${result.template} project at ${result.targetDir}`);
   if(database==="postgres") console.log(result.databaseResult.created?"PostgreSQL database created.":result.databaseResult.reason);
   console.log(result.installResult.installed?`Dependencies installed with ${result.installResult.packageManager}.`:result.installResult.reason);
  });
 await program.parseAsync(argv);
}
