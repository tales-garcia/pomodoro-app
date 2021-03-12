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
    }
}