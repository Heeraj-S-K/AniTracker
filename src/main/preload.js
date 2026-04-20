const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  fileExists: (filePath) => ipcRenderer.invoke('fs:fileExists', filePath),
  openExternal: (filePath) => ipcRenderer.invoke('shell:openExternal', filePath),
});
