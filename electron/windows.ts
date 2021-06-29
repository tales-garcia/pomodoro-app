import { BrowserWindow } from "electron";
import createMenu from "./menu";
import path from 'path';
import * as url from 'url';

let dashboardWindow: BrowserWindow | null;

export default {
    createTimer: (windowProps?: Electron.BrowserWindowConstructorOptions) => {
        
        const window = new BrowserWindow({
            width: 400,
            height: 550,
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
            alwaysOnTop: false,
            fullscreenable: false,
            frame: process.platform === 'darwin',
            transparent: process.platform === 'darwin',
            acceptFirstMouse: true,
            title: 'Timer',
            ...windowProps
        })

        if (process.env.NODE_ENV === 'development') {
            window.loadURL('http://localhost:4000')
        } else {
            window.loadURL(
                url.format({
                    pathname: path.join(__dirname, 'renderer/index.html'),
                    protocol: 'file:',
                    slashes: true
                })
            )
        }

        createMenu();

        return window;
    },
    createDashboard: (windowProps?: Electron.BrowserWindowConstructorOptions) => {
        if (dashboardWindow && !dashboardWindow.isDestroyed()) return;
        
        dashboardWindow = new BrowserWindow({
            backgroundColor: '#1A1A29',
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true
            },
            movable: true,
            resizable: true,
            maximizable: true,
            minimizable: true,
            fullscreen: windowProps?.fullscreen || true,
            fullscreenable: true,
            titleBarStyle: 'hiddenInset',
            ...windowProps
        })

        if (process.env.NODE_ENV === 'development') {
            dashboardWindow.loadURL('http://localhost:4000/#/dashboard').then(() => dashboardWindow?.setTitle('Dashboard'));
        } else {
            dashboardWindow.loadURL(
                url.format({
                    pathname: path.join(__dirname, 'renderer/index.html'),
                    protocol: 'file:',
                    hash: '/dashboard',
                    slashes: true
                })
            ).then(() => dashboardWindow?.setTitle('Dashboard'))
        }

        return dashboardWindow;
    }
}