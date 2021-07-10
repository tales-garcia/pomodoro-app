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

        let finalProps: Electron.BrowserWindowConstructorOptions = {
            backgroundColor: '#1A1A29',
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true
            },
            movable: true,
            resizable: true,
            maximizable: true,
            minimizable: true,
            fullscreenable: true,
            titleBarStyle: 'hiddenInset',
        }

        if (!!windowProps && !windowProps.fullscreen) {
            finalProps = {
                ...finalProps,
                ...windowProps
            }
        } else {
            finalProps.fullscreen = true;
        }

        dashboardWindow = new BrowserWindow(finalProps)

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

        createMenu()

        return dashboardWindow;
    },
    createSettings: () => {

        const window = new BrowserWindow({
            width: 700,
            height: 600,
            backgroundColor: '#1A1A29',
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true
            },
            movable: true,
            resizable: true,
            titleBarStyle: 'hiddenInset',
            fullscreenable: true,
            frame: process.platform === 'darwin',
            transparent: process.platform === 'darwin',
            acceptFirstMouse: true,
        })

        if (process.env.NODE_ENV === 'development') {
            window.loadURL('http://localhost:4000/#/settings').then(() => dashboardWindow?.setTitle('Settings'));
        } else {
            window.loadURL(
                url.format({
                    pathname: path.join(__dirname, 'renderer/index.html'),
                    protocol: 'file:',
                    slashes: true,
                    hash: '/settings'
                })
            ).then(() => dashboardWindow?.setTitle('Settings'));
        }

        createMenu();

        return window;
    }
}