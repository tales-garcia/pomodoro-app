import { ipcMain } from "electron";
import { createWindow, mainWindow } from "./main"

export default {
    create: (time: number) => {
        ipcMain.prependOnceListener('get-time', (ev) => {
            ev.returnValue = [time, time];
        });

        createWindow();
    },
    set(time: number) {
        if (!mainWindow) {
            this.create(time);
            return;
        }

        mainWindow!.webContents.send('set-time', time);
    },
    reset() {
        if (mainWindow)
        mainWindow.webContents.send('set-time', 0);
    },
    close: () => {
        mainWindow?.close();
    }
} as { [key: string]: (...args: any[]) => void }