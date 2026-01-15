const { contextBridge } = require('electron');

// Exponer APIs al renderer
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  nodeVersion: process.version,
  chromeVersion: process.versions.chrome,
  electronVersion: process.versions.electron
});
