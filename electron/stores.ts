import { app } from 'electron';
import { v4 } from 'uuid';
import Store from './store';

interface Window {
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    id: string;
    type: 'timer' | 'dashboard' | 'settings';
    time?: number;
    maxTime?: number;
    name?: string;
}


export const windowsStore = new Store<{ windows: Array<Window> }>({
    default: {
        windows: [
            {
                bounds: { fullscreen: true } as any,
                id: v4(),
                type: 'dashboard'
            }
        ]
    },
    filename: 'windows'
});


export const workspacesStore = new Store<Workspace[]>({
    filename: 'workspaces',
    default: []
});

export const recentStore = new Store<Timer[]>({
    default: [],
    filename: 'recent'
});

export const settingsStore = new Store<ISettings>({
    default: {
        displaySplash: true,
        enableRecents: true,
        language: app.getLocale() as any,
        openLastSession: true,
        theme: 'system'
    },
    filename: 'settings'
});