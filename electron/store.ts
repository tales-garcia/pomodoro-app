import { app, remote } from 'electron';
import path from 'path';
import fs from 'fs';

interface Options<T> {
    filename: string;
    default: T;
}

class Store<T = any> {
    constructor(opts: Options<T>) {
        const userDataPath = (app || remote.app).getPath('userData');
        const filepath = path.join(userDataPath, opts.filename + '.json');

        return new Proxy<Store<T>>(parseDataFile(filepath, opts.default), {
            set(target: any, key, value) {
                try {
                    fs.writeFileSync(filepath, JSON.stringify(target));
                    return Reflect.set(target, key, value);
                } catch (e) {
                    return false;
                }
            }
        });
    }
}

function parseDataFile(filePath: string, defaults: any) {
    try {
        return JSON.parse(fs.readFileSync(filePath).toString());
    } catch (error) {
        return defaults;
    }
}

export default Store as { new <T>(opts: Options<T>): T };