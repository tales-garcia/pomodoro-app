import { ipcMain } from "electron";
import { mainWindow } from "./main"
import windows from "./windows";

interface ITimerProps {
    time: number;
    name?: string;
}

export default {
    create: ({ time, name }: ITimerProps) => {
        ipcMain.prependOnceListener('get-timer-props', (ev) => {
            ev.returnValue = {
                storedTime: time,
                name,
                storedMaxTime: time
            };
        });

        windows.createTimer();
    },
    set(time: number) {
        if (!mainWindow) {
            this.create({ time });
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
}