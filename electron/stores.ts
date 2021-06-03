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
    type: 'timer' | 'dashboard';
    time?: number;
    maxTime?: number;
    name?: string;
}


export const windowsStore = new Store<{ windows: Array<Window> }>({
    default: {
        windows: [
            {
                bounds: { x: 500, y: 195, width: 400, height: 550 },
                id: v4(),
                type: 'timer'
            }
        ]
    },
    filename: 'windows'
});


export const workspacesStore = new Store<Workspace[]>({
    filename: 'workspaces',
    default: []
});