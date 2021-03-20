import { app, BrowserWindow, ipcMain } from 'electron'
import timer from './timer';
import windows from './windows';
import Store from './store';
import { v4 } from 'uuid';

interface Window {
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  id: number;
  time?: number;
  maxTime?: number;
}

export let mainWindow: Electron.BrowserWindow | null;
const windowsStore = new Store<{ windows: Array<Window> }>({
  default: {
    windows: [
      {
        bounds: { x: 500, y: 195, width: 400, height: 500 },
        id: 1
      }
    ]
  },
  filename: 'windows'
});

export function createWindow() {
  mainWindow = windows.createTimer();
}

function createInitialWindows() {
  windowsStore.get('windows').forEach(({ time, bounds, maxTime }) => {
    mainWindow = windows.createTimer(bounds, {
      time,
      maxTime
    });

    mainWindow.on('close', () => mainWindow = null);
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('ready', createInitialWindows);
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

ipcMain.on('get-time', (ev, id) => {
  ev.returnValue = windowsStore.get('windows').find(window => window.id === id)?.time;
})

app.on('before-quit', event => {
  if (!BrowserWindow.getAllWindows().length) return;
  event.preventDefault();
  const windowsBounds: any[] = [];

  BrowserWindow.getAllWindows().forEach(browserWindow => {
    ipcMain.removeAllListeners('get-time-reply');
    const handleGetTimeReply = (_: any, time: number, maxTime: number) => {
      windowsBounds.push({
        bounds: BrowserWindow.fromWebContents(_.sender)!.getBounds(),
        time,
        id: BrowserWindow.fromWebContents(_.sender)!.id,
        maxTime
      })

      if (windowsBounds.length >= BrowserWindow.getAllWindows().length) {
        windowsStore.set('windows', windowsBounds)
        app.exit()
      }
    }

    ipcMain.on('get-time-reply', handleGetTimeReply);
    browserWindow.webContents.send('get-time');
  });
});