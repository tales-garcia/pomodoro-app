import { app, BrowserWindow, ipcMain } from 'electron'
import timer from './timer';
import windows from './windows';
import Store from './store';

export let mainWindow: Electron.BrowserWindow | null;
const windowsStore = new Store<{ windows: Array<{ x: number, y: number, width: number, height: number }> }>({
  default: {
    windows: [
      { x: 500, y: 195, width: 400, height: 500 }
    ]
  },
  filename: 'windows'
});

export function createWindow() {
  windowsStore.get('windows').forEach(bounds => {
    mainWindow = windows.createTimer(bounds);

    mainWindow.on('close', () => mainWindow = null);
  });
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

app.on('before-quit', () => {
  const windowsBounds = BrowserWindow.getAllWindows().map(browserWindow => {
    return {
      ...browserWindow.getBounds()
    };
  });

  windowsStore.set('windows', windowsBounds);
});