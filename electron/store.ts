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
            set(target, key, value) {
                try {
                    const finalStore = {
                        ...target,
                        [key]: value
                    }

                    fs.writeFileSync(filepath, JSON.stringify(finalStore));
                    return true;
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