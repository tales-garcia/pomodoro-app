import { ipcMain } from "electron";
import { mainWindow } from "./main"
import windows from "./windows";

export default {
    create: (time: number) => {
        ipcMain.prependOnceListener('get-time', (ev) => {
            ev.returnValue = [time, time];
        });

        windows.createTimer();
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