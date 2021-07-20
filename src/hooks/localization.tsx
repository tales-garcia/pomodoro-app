import { ipcRenderer } from 'electron';
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useState } from 'react';

type Messages = {
    [key: string]: Messages | string;
}

interface LocalizationContextContent {
    messages: Messages;
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

    const changeLocale = useCallback((locale: string) => {
        setLocale(locale);
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