import { ipcRenderer } from 'electron';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';

interface ThemeHelperContextContent {
    mode: 'light' | 'dark'
}

const themes: { [key in 'dark' | 'light']: DefaultTheme } = {
    dark: {
        blue: '#24243B',
        darkBlue: '#151423',
        red: '#D93C3C',
        text: '#E4E4E4',
        gradient: 'linear-gradient(146.1deg, #1D1C30 0%, #31314E 100%)',
        keyBackground: '#1f1f33',
        switchBackground: '#292929'
    },
    light: {
        blue: '#F9F9F9',
        darkBlue: '#E7E7E7',
        red: '#D93C3C',
        text: '#272727',
        gradient: 'linear-gradient(146.1deg, #E7E7E7 0%, #F9F9F9 100%)',
        keyBackground: '#e6e6e6',
        switchBackground: '#d1d1d1'
    }
}

const ThemeHelperContext = createContext<ThemeHelperContextContent>({} as ThemeHelperContextContent);

export const useThemeHelper = () => {
    const context = useContext(ThemeHelperContext);

    if (!context) {
        throw new Error('useThemeHelper must be used within ThemeHelperProvider');
    }

    return context;
}

export const ThemeHelperProvider: React.FC = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>(ipcRenderer.sendSync('get-theme'));

    useEffect(() => {
        ipcRenderer.on('update-theme', () => {
            setMode(ipcRenderer.sendSync('get-theme'))
        });
    }, []);

    return (
        <ThemeHelperContext.Provider
            value={{
                mode
            }}
        >
            <ThemeProvider theme={themes[mode]}>
                {children}
            </ThemeProvider>
        </ThemeHelperContext.Provider>
    )
}