import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import * as url from 'url'

let mainWindow: Electron.BrowserWindow | null;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    backgroundColor: '#1A1A29',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    movable: true,
    resizable: true,
    maximizable: false,
    minimizable: false,
    titleBarStyle: 'hiddenInset',
    alwaysOnTop: true,
    fullscreenable: false,
    frame: process.platform === 'darwin',
    transparent: process.platform === 'darwin',
    acceptFirstMouse: true
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000')
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.allowRendererProcessReuse = true
