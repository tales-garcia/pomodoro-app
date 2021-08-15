interface Timer {
    id: string;
    name: string;
    time: number;
}

interface Workspace {
    id: string;
    name: string;
    timers: Timer[];
}

interface WorkspaceDTO {
    name: string;
}

interface ITimerDTO extends Omit<Timer, "id"> {
    workspaceId: string;
}

declare type TIterable = { [key: string]: any };

interface ISettings extends TIterable {
    enableRecents: boolean;
    openLastSession: boolean;
    displaySplash: boolean;
    theme: 'dark' | 'light' | 'system';
    language: keyof Locales;
}