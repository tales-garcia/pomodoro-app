import { app, remote } from 'electron';
import path from 'path';
import fs from 'fs';

interface Options<T> {
    filename: string;
    default: T;
}

class Store<T = any> {
    private path: string;
    data: T;

    constructor(opts: Options<T>) {
        const userDataPath = (app || remote.app).getPath('userData');
        this.path = path.join(userDataPath, opts.filename + '.json');

        this.data = parseDataFile(this.path, opts.default);
    }

    get(key: keyof T): T[keyof T] {
        return (this.data as {[key in keyof T]: any})[key];
    }

    set(key: keyof T, val: T[keyof T]): void {
        (this.data as {[key in keyof T]: any})[key] = val;
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }
}

function parseDataFile(filePath: string, defaults: any) {
    try {
        return JSON.parse(fs.readFileSync(filePath).toString());
    } catch (error) {
        return defaults;
    }
}

export default Store;