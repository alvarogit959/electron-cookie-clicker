const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
//npm install
//npm install -g @angular/cli@21.0.0
//npm install -g @angular/cli@latest
//npm run
//npm run start

//npm start                    en una terminal
//npm run electron:dev         en otra terminal

//TO DO:
//abrir puntuaciones tras finalizar         ARREGLAR puntuaciones-button
//guardar puntuaciones
//configurar servidor
//mongodb?

let mainWindow;
let clickCount = 0;
// Temporizador principal (30s)
function timerDown() {
  console.log('timerDown iniciado');
  let time = 5;               //AJUSTAR TIEMPO AL FINAL DEL TIMER TAMBIEN
  // Enviar valor inicial inmediatamente
  if (mainWindow && mainWindow.webContents) mainWindow.webContents.send('from-main', `Tiempo restante: ${time}`);
  console.log(`Tiempo restante: ${time}`);

  const timer = setInterval(() => {
    time--;
    //if(time>=0){} 
    if (mainWindow && mainWindow.webContents) mainWindow.webContents.send('from-main', `Tiempo restante: ${time}`);
    console.log(`Tiempo restante: ${time}`);
  }, 1000);

  setTimeout(() => {
    clearInterval(timer);
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('from-main', 'Tiempo restante: 0');
      mainWindow.webContents.send('update-display', `¡Tiempo terminado! Has hecho ${clickCount} clicks.`);
      console.log(`¡Tiempo terminado! Has hecho ${clickCount} clicks.`);
      mainWindow.webContents.send('disable-button');
    }
  }, 5000);
}
let starting=false;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  });

  ipcMain.on('click-button', (event, message) => {
  if (starting===false){timerDown();starting=true}
    console.log('funciona el ipcMain', message);

    clickCount++;
    console.log('clickCount:', clickCount);

    try {
      mainWindow.webContents.send('update-display', 'Número de clicks: ' + clickCount);
      console.log('Mensaje enviado al display');
    } catch (error) {
      console.error('Error al enviar el mensaje al renderer:', error);
    }
  });

  //Cargar desde localhost en desarrollo    npm run electron:dev
  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:4200', {
      extraHeaders: 'pragma: no-cache\n',
    });
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.session.clearCache();
    mainWindow.webContents.reloadIgnoringCache();
  } else {
    // En producción: cargar archivo construido
    mainWindow.loadFile(path.join(__dirname, 'dist/electron-cookie-clicker/src/app/app.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Mostrar Scores:
ipcMain.on('puntuaciones-button', (event, message) => {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('navigate-to-scores');}
});



app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
