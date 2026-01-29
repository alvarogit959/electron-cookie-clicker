const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  
  // Para el contador
  clickButton: (message) => ipcRenderer.send('click-button', message),
  
  // Para recibir actualizaciones
  onMain: (channel, listener) => {
    const allowed = ['from-main', 'update-display', 'timer', 'disable-button'];
    if (allowed.includes(channel)) {
      ipcRenderer.on(channel, listener);
    }
  },
  
  // Navegación
  navigateToScores: () => {
    console.log('Enviando: puntuaciones-button');
    ipcRenderer.send('puntuaciones-button');
  },
  
  navigateToApp: () => {
    console.log('Enviando: return-button');
    ipcRenderer.send('return-button');
  },
  
  // Control de ventanas
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  closeScoresWindow: () => ipcRenderer.send('close-scores-window'),
  
  // Para obtener puntuaciones del servidor
  fetchScores: async () => {
    try {
      const response = await fetch('http://localhost:5000/cookies');
      return await response.json();
    } catch (error) {
      console.error('Error fetching scores:', error);
      return [];
    }
  },
  
  // Para guardar puntuación
  saveScore: async (name, clicks) => {
    try {
      const response = await fetch('http://localhost:5000/cookies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, clicks }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving score:', error);
      return null;
    }
  }
});