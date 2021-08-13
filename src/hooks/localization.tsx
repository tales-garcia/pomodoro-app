import { ipcRenderer } from 'electron';
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useState } from 'react';
import { FileLocale } from '../../@types/locale';

const LocalizationContext = createContext<FileLocale>({} as FileLocale);

export const useLocalization = () => {
    const context = useContext(LocalizationContext);

    if (!context) {
        throw new Error('useLocalization must be used within LocalizationProvider');
    }

    return context;
}

export const LocalizationProvider: React.FC = ({ children }) => {
    const [locale, setLocale] = useState<string | undefined>(undefined);

    const formattedMessages = useMemo(() => ipcRenderer.sendSync('get-localized-messages', locale), [locale]);

    useEffect(() => {
        ipcRenderer.on('set-locale', (_, newLocale) => setLocale(newLocale));
    }, []);

    return (
        <LocalizationContext.Provider
            value={formattedMessages}
        >
            {children}
        </LocalizationContext.Provider>
    )
}