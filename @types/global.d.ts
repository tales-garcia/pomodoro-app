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