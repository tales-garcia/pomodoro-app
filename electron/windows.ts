import { BrowserWindow } from "electron";
import createMenu from "./menu";
import path from 'path';
import * as url from 'url';
import getTheme from "./theme";

let dashboardWindow: BrowserWindow | null;

export default {
    createTimer: (windowProps?: Electron.BrowserWindowConstructorOptions) => {

        const window = new BrowserWindow({
            width: 400,
            height: 550,
            backgroundColor: getTheme() === 'light' ? '#ECECEC' : '#1A1A29',
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
            window.loadURL('http://localhost:4000/#/timer')
        } else {
            window.loadURL(
                url.format({
                    pathname: path.join(__dirname, 'renderer/index.html'),
                    protocol: 'file:',
                    slashes: true,
                    hash: '/timer'
                })
            )
        }

        createMenu();

        return window;
    },
    createDashboard: (windowProps?: Electron.BrowserWindowConstructorOptions) => {
        if (dashboardWindow && !dashboardWindow.isDestroyed()) return;

        let finalProps: Electron.BrowserWindowConstructorOptions = {
            backgroundColor: getTheme() === 'light' ? '#ECECEC' : '#1A1A29',
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
            height: 640,
            backgroundColor: getTheme() === 'light' ? '#ECECEC' : '#1A1A29',
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true
            },
            movable: true,
            resizable: true,
            titleBarStyle: 'hiddenInset',
            fullscreenable: false,
            maximizable: false,
            frame: process.platform === 'darwin',
            transparent: process.platform === 'darwin',
            acceptFirstMouse: true,
        })

        if (process.env.NODE_ENV === 'development') {
            window.loadURL('http://localhost:4000/#/settings').then(() => window?.setTitle('Settings'));
        } else {
            window.loadURL(
                url.format({
                    pathname: path.join(__dirname, 'renderer/index.html'),
                    protocol: 'file:',
                    slashes: true,
                    hash: '/settings'
                })
            ).then(() => window?.setTitle('Settings'));
        }

        createMenu();

        return window;
    },
    createSplash: () => {
        const window = new BrowserWindow({
            width: 400,
            height: 400,
            backgroundColor: getTheme() === 'light' ? '#ECECEC' : '#1A1A29',
            webPreferences: {
                nodeIntegration: true
            },
            movable: true,
            resizable: false,
            fullscreenable: false,
            frame: false,
            transparent: true
        })

        if (process.env.NODE_ENV === 'development') {
            window.loadURL('http://localhost:4000/#/splash').then(() => window?.setTitle('Splash'));
        } else {
            window.loadURL(
                url.format({
                    pathname: path.join(__dirname, 'renderer/index.html'),
                    protocol: 'file:',
                    slashes: true,
                    hash: '/splash'
                })
            ).then(() => window?.setTitle('Splash'));
        }

        createMenu();

        return window;
    }
}