import { ipcMain } from "electron";
import { v4 } from "uuid";
import { idsTranslator } from "./main";
import { windowsStore, workspacesStore } from './stores';
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
        const window = windowsStore.windows.filter(window => window.type === 'timer').find((win) => win.id === idsTranslator[id]);

        ev.returnValue = {
            storedTime: window?.time,
            storedMaxTime: window?.maxTime,
            title: window?.title
        }

        getTimeCalledTimes++;
        if (getTimeCalledTimes === windowsStore.windows.filter(window => window.type === 'timer').length) {
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

        workspacesStore.push(workspace);

        ev.returnValue = workspace;
    },
    'get-workspaces': (ev) => {
        ev.returnValue = JSON.parse(JSON.stringify(workspacesStore));
    },
    'delete-workspace': (ev, id: string) => {
        const workspaceIndex = workspacesStore.findIndex(workspace => workspace.id === id);
        workspacesStore.splice(workspaceIndex, 1);
        ev.returnValue = JSON.parse(JSON.stringify(workspacesStore));
    }
} as Events;