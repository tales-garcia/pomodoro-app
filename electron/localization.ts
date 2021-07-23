import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { FileLocale } from '../@types/locale';

export default function getLocalization(locale?: string) : FileLocale {
    const finalLocale = !!locale ? locale : app.getLocale();
    const localesDir = path.join(__dirname, '/locales/');

    if (fs.existsSync(path.join(localesDir, `${finalLocale}.json`))) {
        const rawData = fs.readFileSync(path.join(localesDir, `${finalLocale}.json`)) as any as string;
        return JSON.parse(rawData);
    }

    const rawData = fs.readFileSync(path.join(localesDir, `en-US.json`)) as any as string;

    return JSON.parse(rawData);
}