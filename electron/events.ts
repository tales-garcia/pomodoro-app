import { ipcMain } from "electron";
import { windowsStore, idsTranslator } from "./main";

type Events = {
    [channel: string]: (event: Electron.IpcMainEvent, ...args: any[]) => void;
}

let getTimeCalledTimes = 0;

export default {
    'get-time': (ev, id) => {
        const window = windowsStore.get('windows').filter(window => window.type === 'timer').find((win) => win.id === idsTranslator[id]);

        ev.returnValue = [window?.time, window?.maxTime];

        getTimeCalledTimes++;
        if (getTimeCalledTimes === windowsStore.get('windows').filter(window => window.type === 'timer').length) {
            ipcMain.emit('initial-windows-created');
        }
    }
} as Events;