import { spawn } from "node:child_process";
const INSTALL_ARGS = { npm: ["install"], pnpm: ["install"], yarn: ["install"], bun: ["install"] };
export function installDependencies(cwd, packageManager = "npm") {
  const args = INSTALL_ARGS[packageManager];
  if (!args) throw new Error(`Unsupported package manager: ${packageManager}`);
  return new Promise((resolve, reject) => {
    const child = spawn(packageManager, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });
    child.once("error", reject);
    child.once("close", (code) => code === 0 ? resolve({ installed: true, packageManager }) : reject(new Error(`${packageManager} install exited with code ${code}`)));
  });
}
