const { app, BrowserWindow, ipcMain, dialog, protocol, net } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// Register custom protocol scheme securely
protocol.registerSchemesAsPrivileged([
  { scheme: 'video', privileges: { bypassCSP: true, supportFetchAPI: true, stream: true } }
]);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    title: 'AskUrSenpai',
    backgroundColor: '#0d0f1a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true, // Keep web security enabled
    },
  });

  // Load Vite dev server in development
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.setMenuBarVisibility(false);
}

// IPC: Open file dialog for video selection
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Episode Video File',
    properties: ['openFile'],
    filters: [
      { name: 'Video Files', extensions: ['mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv', 'kmp'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

// IPC: Open directory dialog for batch importing
ipcMain.handle('dialog:openDirectory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Folder with Episodes',
    properties: ['openDirectory'],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  
  const folderPath = result.filePaths[0];
  try {
    const files = await fs.promises.readdir(folderPath);
    // filter for video files including mkv and kmp
    const videoFiles = files.filter(f => 
      ['.mp4', '.mkv', '.avi', '.mov', '.webm', '.wmv', '.flv', '.kmp'].some(ext => f.toLowerCase().endsWith(ext))
    );
    return videoFiles.map(file => ({
      name: file,
      path: path.join(folderPath, file)
    }));
  } catch (err) {
    console.error('Failed to read folder', err);
    return [];
  }
});

// IPC: Check if a file exists
ipcMain.handle('fs:fileExists', async (_event, filePath) => {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
});

// IPC: Open file in system default player
const { shell } = require('electron');
ipcMain.handle('shell:openExternal', async (_event, filePath) => {
  return await shell.openPath(filePath);
});

// Enable HEVC support for MKV files if OS supports hardware decode
app.commandLine.appendSwitch('enable-features', 'PlatformHEVCDecoderSupport');

app.whenReady().then(() => {
  // Handle custom 'video://' scheme using registerFileProtocol for better range request support
  protocol.registerFileProtocol('video', (request, callback) => {
    let filePath = request.url.replace('video://', '');
    // Decode URI component to handle spaces and special characters
    filePath = decodeURIComponent(filePath);
    // On Windows, paths might come in as /C:/... we should normalize slightly
    if (process.platform === 'win32' && filePath.startsWith('/')) {
        filePath = filePath.slice(1);
    }
    callback({ path: path.normalize(filePath) });
  });
  
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
