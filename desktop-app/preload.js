const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Store operations
  getStore: (key) => ipcRenderer.invoke('store-get', key),
  setStore: (key, value) => ipcRenderer.invoke('store-set', key, value),
  deleteStore: (key) => ipcRenderer.invoke('store-delete', key),

  // Notifications
  showNotification: (title, body) => ipcRenderer.send('show-notification', { title, body }),

  // Tray status
  updateTrayStatus: (status) => ipcRenderer.send('update-tray-status', status),

  // Navigation listener
  onNavigate: (callback) => ipcRenderer.on('navigate', (event, page) => callback(page)),

  // Platform info
  platform: process.platform
});
