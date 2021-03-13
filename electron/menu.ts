import { app, BrowserWindow, Menu } from "electron";
import { createWindow } from "./main";
import timer from "./timer";

export default function createMenu(window: BrowserWindow | null) {
    const dockMenu = Menu.buildFromTemplate([
        ...(process.platform === 'darwin' ? [{
            label: app.getName(),
            submenu: [

            ]
        }] : []),
        {
            label: 'New Timer',
            submenu: [
                { label: 'Custom', click: createWindow },
                {
                    label: 'Presets',
                    submenu: [
                        {
                            label: '25min', click: () => timer.create(25 * 60)
                        },
                        {
                            label: '15min', click: () => timer.create(15 * 60)
                        },
                        {
                            label: '10min', click: () => timer.create(10 * 60)
                        },
                        {
                            label: '5min', click: () => timer.create(5 * 60)
                        },
                        {
                            label: '1min', click: () => timer.create(60)
                        }
                    ]
                }
            ],
        },
        {
            label: 'Edit',
            submenu: [
                { label: 'Close', click: timer.close },
                { label: 'Reset', click: timer.reset },
                {
                    label: 'Set time',
                    submenu: [
                        {
                            label: '25min', click: () => timer.set(25 * 60)
                        },
                        {
                            label: '15min', click: () => timer.set(15 * 60)
                        },
                        {
                            label: '10min', click: () => timer.set(10 * 60)
                        },
                        {
                            label: '5min', click: () => timer.set(5 * 60)
                        },
                        {
                            label: '1min', click: () => timer.set(60)
                        }
                    ]
                }
            ],
        }
    ])

    app.whenReady().then(() => {
        app.dock.setMenu(dockMenu)
        Menu.setApplicationMenu(dockMenu)
    });
}