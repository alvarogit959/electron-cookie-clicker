const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
//npm install
//npm install -g @angular/cli@21.0.0
//npm install -g @angular/cli@latest
//npm run
//npm run start

//npm start                    en una terminal
//npm run electron:dev         en otra terminal

//TO DO
//Contador de tiempo
//Primer click lo activa
//tras 30 segundos se desactiva el boton
//abrir puntuaciones tras finalizar
//

let mainWindow;
let clickCount = 0;
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
