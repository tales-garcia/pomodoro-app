import { ipcRenderer } from 'electron';
import React, { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext<ISettings>({} as ISettings);

export const useSettings = () => {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }

    return context;
}

export const SettingsProvider: React.FC = ({ children }) => {
    const [settings, setSettings] = useState<ISettings>(ipcRenderer.sendSync('get-settings'));

    useEffect(() => {
        ipcRenderer.on('update-settings', (_, updated: ISettings) => {
            setSettings(updated);
        })
    }, []);

    return (
        <SettingsContext.Provider
            value={settings}
        >
            {children}
        </SettingsContext.Provider>
    )
}