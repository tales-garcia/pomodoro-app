import { app, BrowserWindow, ipcMain } from 'electron'
import timer from './timer';
import windows from './windows';
import { v4 } from 'uuid';
import tray from './tray';
import events from './events';
import { windowsStore } from './stores';

export const idsTranslator: { [key: number]: string } = {};
export let mainWindow: Electron.BrowserWindow | null;

Object.keys(events).forEach(event => ipcMain.on(event, events[event]));

function createInitialWindows() {
  windowsStore.windows.forEach(({ bounds, id, type }) => {
    const typeToMethod: {
      [key in typeof type]: keyof typeof windows;
    } = {
      dashboard: 'createDashboard',
      timer: 'createTimer',
      settings: 'createSettings'
    };

    mainWindow = windows[typeToMethod[type]](bounds) || null;

    idsTranslator[mainWindow!.id] = id;

    mainWindow!.on('close', () => mainWindow = null);
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

app.once('ready', () => {
  tray.create();

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

    (timer as any)[command](args);
  });

})

app.on('before-quit', event => {
  tray.destroy();
  if (!BrowserWindow.getAllWindows().length) return;
  event.preventDefault();
  const windowsBounds: any[] = [];

  BrowserWindow.getAllWindows().forEach(browserWindow => {
    if (browserWindow.webContents.getURL().includes('dashboard')) {
      windowsBounds.push({
        bounds: {
          ...browserWindow.getBounds(),
          fullscreen: browserWindow.isFullScreen()
        },
        type: 'dashboard',
        id: v4()
      });

      if (windowsBounds.length >= BrowserWindow.getAllWindows().length) {
        windowsStore.windows = windowsBounds;
        app.exit()
      }

      return;
    }
    ipcMain.removeAllListeners('get-time-reply');
    const handleGetTimeReply = (_: any, time: number, maxTime: number) => {
      windowsBounds.push({
        bounds: BrowserWindow.fromWebContents(_.sender)!.getBounds(),
        time,
        type: 'timer',
        maxTime,
        id: v4()
      })

      if (windowsBounds.length >= BrowserWindow.getAllWindows().length) {
        windowsStore.windows = windowsBounds;
        app.exit()
      }
    }

    ipcMain.on('get-time-reply', handleGetTimeReply);
    browserWindow.webContents.send('get-time');
  });
});
app.setAboutPanelOptions({
  applicationName: 'Pomodoro',
  authors: ['Tales Garcia<garcia.tales@gmail.com>'],
  copyright: 'Copyright © 2021 Tales Garcia'
});