const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("forgekit", {
  getTemplates: () => ipcRenderer.invoke("forgekit:templates"),
  chooseDirectory: () => ipcRenderer.invoke("forgekit:choose-directory"),
  createProject: (options) => ipcRenderer.invoke("forgekit:create-project", options),
  showFolder: (folderPath) => ipcRenderer.invoke("forgekit:show-folder", folderPath)
});
