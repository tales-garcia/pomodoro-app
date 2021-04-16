import { ipcMain } from "electron";
import { v4 } from "uuid";
import { windowsStore, idsTranslator } from "./main";
import timer from "./timer";

interface ITimerProps {
    time: number;
    title?: string;
}

type Events = {
    [channel: string]: (event: Electron.IpcMainEvent, ...args: any[]) => void;
}

let getTimeCalledTimes = 0;

export default {
    'get-timer-props': (ev, id) => {
        const window = windowsStore.get('windows').filter(window => window.type === 'timer').find((win) => win.id === idsTranslator[id]);

        ev.returnValue = {
            storedTime: window?.time,
            storedMaxTime: window?.maxTime,
            title: window?.title
        }

        getTimeCalledTimes++;
        if (getTimeCalledTimes === windowsStore.get('windows').filter(window => window.type === 'timer').length) {
            ipcMain.emit('initial-windows-created');
        }
    },
    'create-timer': (_, { time, title }: ITimerProps) => {
        timer.create({
            time,
            title
        });
    },
    'create-workspace': (ev, workspaceDto: WorkspaceDTO) => {
        const workspace = {
            ...workspaceDto,
            timers: [],
            id: v4()
        } as Workspace;

        ev.returnValue = workspace;
    }
} as Events;