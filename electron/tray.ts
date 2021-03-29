import { Menu, Tray } from "electron";
import path from 'path';

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
                label: 'Dashboard'
            }
        ]));

    },
    destroy() {
        this.tray?.destroy();
    },
    setContextMenu(menu) {
        this.setContextMenu(menu);
    }
} as TrayObject;