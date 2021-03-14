import { app } from 'electron'
import timer from './timer';
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

app.whenReady().then(() => {
  if (!app.isDefaultProtocolClient('pomodoro')) {
    app.setAsDefaultProtocolClient('pomodoro');
  }
})

app.on('open-url', function (event, url) {
  event.preventDefault()
  
  app.whenReady().then(() => {
    app.focus();
    const [command, ...args] = url.replace('pomodoro://', '').split('/');

    timer[command](args);
  });

})