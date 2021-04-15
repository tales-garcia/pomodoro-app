import { ipcMain } from "electron";
import { mainWindow } from "./main"
import windows from "./windows";

interface ITimerProps {
    time: number;
    title?: string;
}

export default {
    create: ({ time, title }: ITimerProps) => {
        ipcMain.prependOnceListener('get-timer-props', (ev) => {
            ev.returnValue = {
                storedTime: time,
                title,
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
} as { [key: string]: (...args: any[]) => void }