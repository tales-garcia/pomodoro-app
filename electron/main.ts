import { app } from 'electron'
import windows from './windows';

export let mainWindow: Electron.BrowserWindow | null;

export function createWindow () {
  mainWindow = windows.createTimer();

  mainWindow.on('close', () => mainWindow = null);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('ready', () => createWindow());
app.on('browser-window-focus', (_, window) => mainWindow = window);

app.allowRendererProcessReuse = true
