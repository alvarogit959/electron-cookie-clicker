const { app, BrowserWindow } = require('electron');
const path = require('path');
//npm install
//npm install -g @angular/cli@21.0.0 
//npm install -g @angular/cli@latest  
//npm run
//npm run start

//npm start                    en una terminal
//npm run electron:dev         en otra terminal
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      webSecurity: false
    }
  });

  // En desarrollo: cargar desde localhost
  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:4200',{
                                                  extraHeaders: 'pragma: no-cache\n'
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
