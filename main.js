const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
//npm install
//npm install -g @angular/cli@21.0.0
//npm install -g @angular/cli@latest
//npm install --save-dev @angular-devkit/build-angular
//npm run
//npm run start

//npm start                    en una terminal
//npm run electron:dev         en otra terminal

//TO DO:
//abrir puntuaciones tras finalizar         ARREGLAR puntuaciones-button
//guardar puntuaciones
//configurar servidor
//mongodb?

//SI DA ERROR PRIMERO: netstat -ano | findstr :4300       LUEGO: tasklist | findstr 12345

let mainWindow;
let scoresWindow = null;
let clickCount = 0;
function getUrl(route = '') {
  const base = `http://localhost:4300`;
  // Para Electron, usa hash navigation
  return route ? `${base}/#${route}` : base;
}
// Temporizador principal (30s)
function timerDown() {
  console.log('timerDown iniciado');
  let time = 5; //AJUSTAR TIEMPO AL FINAL DEL TIMER TAMBIEN
  // Enviar valor inicial inmediatamente
  if (mainWindow && mainWindow.webContents)
    mainWindow.webContents.send('from-main', `Tiempo restante: ${time}`);
  console.log(`Tiempo restante: ${time}`);

  const timer = setInterval(() => {
    time--;
    //if(time>=0){}
    if (mainWindow && mainWindow.webContents)
      mainWindow.webContents.send('from-main', `Tiempo restante: ${time}`);
    console.log(`Tiempo restante: ${time}`);
  }, 1000);

  setTimeout(() => {
    clearInterval(timer);
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('from-main', 'Tiempo restante: 0');
      mainWindow.webContents.send(
        'update-display',
        `¡Tiempo terminado!\n Has hecho ${clickCount} clicks.`,
      );
      console.log(`¡Tiempo terminado! Has hecho ${clickCount} clicks.`);
      mainWindow.webContents.send('disable-button');
    }
  }, 6000);
}

let starting = false;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 700,
    resizable: false,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  });

  if (process.argv.includes('--dev')) {

    mainWindow.loadURL(getUrl());
    mainWindow.webContents.openDevTools({ mode: 'detach' });

  } else {

    mainWindow.loadFile(
      path.join(__dirname, 'dist/electron-cookie-clicker/browser/index.html')
    );

  }}




  ipcMain.on('click-button', (event, message) => {
    if (starting === false) {
      timerDown();
      starting = true;
    }
    console.log('funciona el ipcMain', message);
    clickCount++;
    console.log('clickCount:', clickCount);
    try {
      mainWindow.webContents.send('update-display', 'Número de clicks:' + clickCount);
      console.log('Mensaje enviado al display');
    } catch (error) {
      console.error('Error al enviar el mensaje al renderer:', error);
    }
  });



function createScoresWindow() {
  if (scoresWindow && !scoresWindow.isDestroyed()) {
    scoresWindow.focus();
    return;
  }

  scoresWindow = new BrowserWindow({
    width: 700,
    height: 700,
    resizable: false,
    transparent: true,
    frame: false,
    parent: mainWindow,  //Hace que sea ventana hija
    modal: false,         //ERROR?
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  });
  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    scoresWindow.loadURL('http://localhost:4300/#/scores', {
      extraHeaders: 'pragma: no-cache\n',
    });
  } else {
    scoresWindow.loadFile(path.join(__dirname, 'scoresfolder/scores.html'));
  }

  scoresWindow.on('closed', () => {
    scoresWindow = null;
  });
}

//Min window

ipcMain.on('puntuaciones-button', (event) => {
  console.log('Recibido: puntuaciones-button');
  //createScoresWindow();
});


ipcMain.on('restart-button', () => {
  console.log('Reiniciando juego');

  clickCount = 0;
  starting = false;

  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-display', 'Número de clicks: 0');
    mainWindow.webContents.send('from-main', 'Tiempo restante: 30');
    mainWindow.webContents.send('enable-button');
  }
});


//MIN
ipcMain.on('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

//close
ipcMain.on('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

//close scores 
ipcMain.on('close-scores-window', () => {
  if (scoresWindow && !scoresWindow.isDestroyed()) {
    scoresWindow.close();
  }
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