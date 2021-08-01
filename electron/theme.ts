import { nativeTheme } from "electron";

export default function getTheme() {
    return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
}