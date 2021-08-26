import { BrowserWindow, ipcMain } from "electron";
import { v4 } from "uuid";
import getLocalization, { getAvailableLocales } from "./localization";
import { idsTranslator } from "./main";
import { recentStore, settingsStore, windowsStore, workspacesStore } from './stores';
import getTheme from "./theme";
import timer from "./timer";

interface ITimerProps {
    time: number;
    id?: string;
    name?: string;
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
            name: window?.name
        }

        getTimeCalledTimes++;
        if (getTimeCalledTimes === windowsStore.windows.filter(window => window.type === 'timer').length) {
            ipcMain.emit('initial-windows-created');
        }
    },
    'create-timer-window': (_, { time, name, id }: ITimerProps) => {
        timer.create({
            time,
            name,
            id
        });
    },
    'delete-timer': (ev, id: string) => {
        const workspaceIndex = workspacesStore.findIndex(workspace => !!workspace.timers.find(timer => timer.id === id));
        const timers = workspacesStore[workspaceIndex].timers;

        timers.splice(timers.findIndex(timer => timer.id === id), 1);

        const updatedWorkspace = {
            ...workspacesStore[workspaceIndex],
            timers
        }

        workspacesStore[workspaceIndex] = updatedWorkspace;

        ev.returnValue = updatedWorkspace;
    },
    'create-timer': (ev, { time, name, workspaceId }: ITimerDTO) => {
        const workspaceIndex = workspacesStore.findIndex(workspace => workspace.id === workspaceId);

        const generatedTimer = {
            time,
            name,
            id: v4()
        }

        const originalTimers = workspacesStore[workspaceIndex].timers;

        const updatedWorkspace: Workspace = {
            ...workspacesStore[workspaceIndex],
            timers: [...originalTimers, generatedTimer]
        }

        workspacesStore[workspaceIndex] = updatedWorkspace;

        ev.returnValue = generatedTimer;
    },
    'create-workspace': (ev, workspaceDto: WorkspaceDTO) => {
        const workspace = {
            timers: [],
            ...workspaceDto,
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
    },
    'edit-workspace': (ev, id: string, data: Partial<WorkspaceDTO>) => {
        const workspaceIndex = workspacesStore.findIndex(workspace => workspace.id === id);

        const finalWorkspace = {
            ...workspacesStore[workspaceIndex],
            ...data
        };

        workspacesStore[workspaceIndex] = finalWorkspace;

        ev.returnValue = finalWorkspace;
    },
    'edit-timer': (ev, id: string, data: Partial<Timer>) => {
        const workspaceIndex = workspacesStore.findIndex(workspace => !!workspace.timers.find(timer => timer.id === id));

        const oldTimerIndex = workspacesStore[workspaceIndex].timers.findIndex(timer => timer.id === id);

        const updatedTimers = workspacesStore[workspaceIndex].timers;

        updatedTimers[oldTimerIndex] = {
            ...workspacesStore[workspaceIndex].timers[oldTimerIndex],
            ...data,
        }

        const updatedWorkspace: Workspace = {
            ...workspacesStore[workspaceIndex],
            timers: updatedTimers
        }

        workspacesStore[workspaceIndex] = updatedWorkspace;
        ev.returnValue = JSON.parse(JSON.stringify(workspacesStore));
    },
    'save-workspaces': (_, workspaces: Workspace[]) => {
        workspacesStore.splice(0, workspacesStore.length);
        workspaces.forEach((workspace, index) => {
            workspacesStore[index] = workspace;
        });
    },
    'save-recent': (_, idOrData) => {
        if (!settingsStore.enableRecents) return;

        switch (typeof idOrData) {
            case 'string': {
                const workspace = workspacesStore.find(workspace => !!workspace.timers.find(timer => timer.id === idOrData));

                if (!workspace) return;

                const timer = workspace.timers.find(timer => timer.id === idOrData);
                const timerIndex = recentStore.findIndex(timer => timer.id === idOrData);

                if (timerIndex !== -1) recentStore.splice(timerIndex, 1);

                recentStore.unshift(timer!);
                recentStore.splice(8, Number.MAX_SAFE_INTEGER);
                break;
            }

            case 'object': {
                recentStore.unshift(idOrData);
                recentStore.splice(8, Number.MAX_SAFE_INTEGER);
                break;
            }
        }

        const dashboardWindow = BrowserWindow.getAllWindows().find(win => win.webContents.getURL().includes('dashboard'));

        if (!dashboardWindow) return;

        dashboardWindow.webContents.send('update-recents', JSON.parse(JSON.stringify(recentStore)));
    },
    'get-recents': (ev) => {
        ev.returnValue = JSON.parse(JSON.stringify(recentStore));
    },
    'get-localized-messages': (ev, locale?: string) => {
        ev.returnValue = getLocalization(locale);
    },
    'get-theme': (ev) => {
        ev.returnValue = getTheme();
    },
    'get-settings': (ev) => {
        ev.returnValue = JSON.parse(JSON.stringify(settingsStore));
    },
    'set-settings': (_, settings: Partial<ISettings>) => {
        Object.keys(settings).forEach(key => {
            settingsStore[key] = settings[key];
        });

        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('update-settings', JSON.parse(JSON.stringify(settingsStore)));
        });
    },
    'get-available-locales': (ev) => {
        ev.returnValue = getAvailableLocales();
    }
} as Events;