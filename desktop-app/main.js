const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, Notification } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 380,
    height: 680,
    minWidth: 320,
    minHeight: 500,
    maxWidth: 500,
    maxHeight: 900,
    frame: true,
    resizable: true,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    backgroundColor: '#1E3A5F'
  });

  // Load the production website
  mainWindow.loadURL('https://voice.startmybusiness.us/dashboard');

  // Handle navigation
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorDescription);
    // Show offline page or retry
    mainWindow.loadURL('https://voice.startmybusiness.us/dashboard');
  });

  // Hide instead of close
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'tray-icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon.resize({ width: 16, height: 16 }));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show SMB Voice', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Status: Online', enabled: false },
    { type: 'separator' },
    { label: 'Settings', click: () => {
      mainWindow.show();
      mainWindow.webContents.send('navigate', 'settings');
    }},
    { type: 'separator' },
    { label: 'Quit', click: () => {
      app.isQuitting = true;
      app.quit();
    }}
  ]);

  tray.setToolTip('SMB Voice');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for renderer
ipcMain.handle('store-get', (event, key) => {
  return store.get(key);
});

ipcMain.handle('store-set', (event, key, value) => {
  store.set(key, value);
});

ipcMain.handle('store-delete', (event, key) => {
  store.delete(key);
});

ipcMain.on('show-notification', (event, { title, body }) => {
  new Notification({ title, body }).show();
});

ipcMain.on('update-tray-status', (event, status) => {
  if (tray) {
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Show SMB Voice', click: () => mainWindow.show() },
      { type: 'separator' },
      { label: `Status: ${status}`, enabled: false },
      { type: 'separator' },
      { label: 'Settings', click: () => {
        mainWindow.show();
        mainWindow.webContents.send('navigate', 'settings');
      }},
      { type: 'separator' },
      { label: 'Quit', click: () => {
        app.isQuitting = true;
        app.quit();
      }}
    ]);
    tray.setContextMenu(contextMenu);
  }
});
