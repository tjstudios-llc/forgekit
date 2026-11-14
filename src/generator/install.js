import { spawn } from "node:child_process";

export function installDependencies(cwd, packageManager = "npm") {
  const commands = {
    npm: ["install"],
    pnpm: ["install"],
    yarn: ["install"],
    bun: ["install"]
  };
  if (!commands[packageManager]) throw new Error(`Unsupported package manager: ${packageManager}`);

  return new Promise((resolve, reject) => {
    const child = spawn(packageManager, commands[packageManager], { cwd, stdio: "inherit", shell: process.platform === "win32" });
    child.once("error", reject);
    child.once("close", (code) => {
      if (code === 0) resolve({ installed: true, packageManager });
      else reject(new Error(`${packageManager} install exited with code ${code}`));
    });
  });
}
