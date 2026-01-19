const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs al renderer
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  nodeVersion: process.version,
  chromeVersion: process.versions.chrome,
  electronVersion: process.versions.electron,
  clickButton: (message) => ipcRenderer.send('click-button', message),
  onMain: (channel, listener) => {
    const allowed = ['from-main', 'update-display', 'timer', 'disable-button'];
    if (allowed.includes(channel)) ipcRenderer.on(channel, listener);
  }
});
