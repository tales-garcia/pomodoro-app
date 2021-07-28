import { ipcRenderer } from 'electron';
import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useState } from 'react';
import { FileLocale } from '../../@types/locale';

interface LocalizationContextContent {
    messages: FileLocale;
    changeLocale(locale: keyof Locales): void;
}

const LocalizationContext = createContext<LocalizationContextContent>({} as LocalizationContextContent);

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

    const changeLocale = useCallback((locale: string) => {
        setLocale(locale);
        ipcRenderer.send('set-locale');
    }, []);

    return (
        <LocalizationContext.Provider
            value={{
                messages: formattedMessages,
                changeLocale
            }}
        >
            {children}
        </LocalizationContext.Provider>
    )
}