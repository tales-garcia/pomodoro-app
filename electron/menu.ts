import { app, Menu, MenuItem } from "electron";
import timer from "./timer";
import windows from "./windows";

export default function createMenu() {
    const dockMenu = Menu.buildFromTemplate([
        ...(process.platform === 'darwin' ? [{
            // role: 'appMenu'
            label: 'Pomodoro',
            submenu: [
                {
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Settings',
                    click: () => windows.createSettings(),
                    accelerator: 'Command+,'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'services'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'hide'
                },
                {
                    role: 'hideOthers'
                },
                {
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'quit'
                }
            ]
        }] : [] as any),
        {
            label: 'File',
            submenu: [
                { label: 'Save', click: () => timer.save(), accelerator: 'CommandOrControl+S' },
                { label: 'Close', click: () => timer.close(), accelerator: 'CommandOrControl+W' },
                { label: 'Reset', click: () => timer.reset(), accelerator: 'Shift+CommandOrControl+R' },
                { label: 'Dashboard', click: () => windows.createDashboard(), accelerator: 'Shift+CommandOrControl+T' },
                {
                    label: 'New Timer',
                    submenu: [
                        { label: 'Custom', click: () => windows.createTimer(), accelerator: 'CommandOrControl+N' },
                        {
                            label: 'Presets',
                            submenu: [
                                {
                                    label: '25min', click: () => timer.create({ time: 25 * 60 })
                                },
                                {
                                    label: '15min', click: () => timer.create({ time: 15 * 60 })
                                },
                                {
                                    label: '10min', click: () => timer.create({ time: 10 * 60 })
                                },
                                {
                                    label: '5min', click: () => timer.create({ time: 5 * 60 })
                                },
                                {
                                    label: '1min', click: () => timer.create({ time: 60 })
                                }
                            ]
                        }
                    ],
                },
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
        },
        { role: 'editMenu' },
        { role: 'windowMenu' }
    ])

    app.whenReady().then(() => {
        app.dock.setMenu(dockMenu)
        Menu.setApplicationMenu(dockMenu)
    });
}