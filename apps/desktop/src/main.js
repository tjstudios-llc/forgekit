import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createProject, templates, validateProjectOptions } from "@forgekit/core";
const here = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const win = new BrowserWindow({
    width: 1080, height: 760, minWidth: 760, minHeight: 600,
    backgroundColor: "#101116", title: "ForgeKit",
    webPreferences: { preload: path.join(here, "preload.cjs"), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  win.loadFile(path.join(here, "renderer/index.html"));
}
ipcMain.handle("forgekit:templates", () => [...templates.values()].map(({ id, title, description }) => ({ id, title, description })));
ipcMain.handle("forgekit:choose-directory", async () => {
  const result = await dialog.showOpenDialog({ properties: ["openDirectory", "createDirectory"] });
  return result.canceled ? null : result.filePaths[0];
});
ipcMain.handle("forgekit:create-project", async (_event, payload) => {
  const config = validateProjectOptions({ name: payload.name, template: payload.template, path: payload.parentDirectory, database: "none", install: false });
  const result = await createProject(config);
  return { targetDir: result.targetDir, template: result.template };
});
ipcMain.handle("forgekit:show-folder", async (_event, folderPath) => {
  const error = await shell.openPath(path.resolve(folderPath));
  if (error) throw new Error(error);
  return true;
});
app.whenReady().then(() => { createWindow(); app.on("activate", () => { if (!BrowserWindow.getAllWindows().length) createWindow(); }); });
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
