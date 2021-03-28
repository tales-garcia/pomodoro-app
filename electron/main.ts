import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import timer from './timer';
import windows from './windows';
import Store from './store';
import { v4 } from 'uuid';
import path from 'path';

interface Window {
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  id: string;
  time?: number;
  maxTime?: number;
}
const idsTranslator: { [key: number]: string } = {};
export let mainWindow: Electron.BrowserWindow | null;
let tray: Tray;

export const windowsStore = new Store<{ windows: Array<Window> }>({
  default: {
    windows: [
      {
        bounds: { x: 500, y: 195, width: 400, height: 500 },
        id: v4()
      }
    ]
  },
  filename: 'windows'
});
let getTimeCalledTimes = 0;
ipcMain.on('get-time', (ev, id) => {
  const window = windowsStore.get('windows').find((win) => win.id === idsTranslator[id]);

  ev.returnValue = [window?.time, window?.maxTime];

  getTimeCalledTimes++;
  if (getTimeCalledTimes === BrowserWindow.getAllWindows().length) {
    ipcMain.emit('initial-windows-created');
  }
});

function createInitialWindows() {
  windowsStore.get('windows').forEach(({ bounds, id }) => {
    mainWindow = windows.createTimer(bounds);

    idsTranslator[mainWindow.id] = id;

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
  tray = new Tray(path.resolve(__dirname, '..', 'icons', 'iconTemplate.png'));

  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Dashboard'
    }
  ]));

  if (!app.isDefaultProtocolClient('pomodoro')) {
    app.setAsDefaultProtocolClient('pomodoro');
  }
})

app.on('open-url', function (event, url) {
  event.preventDefault()

  ipcMain.once('initial-windows-created', () => {
    app.focus({
      steal: true
    });
    const [command, ...args] = url.replace('pomodoro://', '').split('/');

    timer[command](args);
  });

})

app.on('before-quit', event => {
  tray.destroy();
  if (!BrowserWindow.getAllWindows().length) return;
  event.preventDefault();
  const windowsBounds: any[] = [];

  BrowserWindow.getAllWindows().forEach(browserWindow => {
    ipcMain.removeAllListeners('get-time-reply');
    const handleGetTimeReply = (_: any, time: number, maxTime: number) => {
      windowsBounds.push({
        bounds: BrowserWindow.fromWebContents(_.sender)!.getBounds(),
        time,
        maxTime,
        id: v4()
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