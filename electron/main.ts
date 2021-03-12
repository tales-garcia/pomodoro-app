import { app } from 'electron'
import windows from './windows';

export let mainWindow: Electron.BrowserWindow | null;

export function createWindow () {
  mainWindow = windows.createTimer();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('ready', () => createWindow());

app.allowRendererProcessReuse = true
