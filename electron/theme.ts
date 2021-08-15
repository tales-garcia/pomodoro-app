import { nativeTheme } from "electron";
import { settingsStore } from "./stores";

export default function getTheme() {
    return settingsStore.theme === 'system' ? nativeTheme.shouldUseDarkColors ? 'dark' : 'light' : settingsStore.theme;
}