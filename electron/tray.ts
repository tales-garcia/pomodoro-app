import { Menu, Tray } from "electron";
import path from 'path';
import timer from "./timer";
import windows from "./windows";

interface TrayObject {
    tray: Tray | null;
    create(): void;
    destroy(): void;
    setContextMenu(menu: Menu): void;
}

export default {
    tray: null,
    create() {
        this.tray = new Tray(path.resolve(__dirname, '..', 'icons', 'iconTemplate.png'));

        this.setContextMenu(Menu.buildFromTemplate([
            {
                label: 'Dashboard',
                click: windows.createDashboard
            },
            {
                label: 'New Timer',
                submenu: [
                    { label: 'Custom', click: windows.createTimer },
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
            },
            {
                role: 'quit'
            }
        ]));

    },
    destroy() {
        this.tray?.destroy();
    },
    setContextMenu(menu) {
        this.tray?.setContextMenu(menu);
    }
} as TrayObject;