import { ipcMain } from "electron";
import { createWindow, mainWindow } from "./main"

export default {
    create: (time: number) => {
        createWindow();

        function handleAppReady() {
            mainWindow!.webContents.send('create-timer', time);
            ipcMain.removeListener('clock-ready', handleAppReady);
        }

        ipcMain.addListener('clock-ready', handleAppReady);
    },
    set(time: number) {
        if (!mainWindow) {
            this.create(time);
            return;
        }

        mainWindow!.webContents.send('create-timer', time);
    },
    reset() {
        if (mainWindow)
        mainWindow.webContents.send('create-timer', 0);
    },
    close: () => {
        mainWindow?.close();
    }
} as { [key: string]: (...args: any[]) => void }