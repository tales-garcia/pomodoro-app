import React, { createContext, useContext } from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';

interface ThemeHelperContextContent {
}

const themes: { [key in 'dark' | 'light']: DefaultTheme } = {
    dark: {
        blue: '#24243B',
        darkBlue: '#151423',
        red: '#D93C3C',
        text: '#E4E4E4',
        gradient: 'linear-gradient(146.1deg, #1D1C30 0%, #31314E 100%)',
        keyBackground: '#1f1f33'
    },
    light: {
        blue: '#F9F9F9',
        darkBlue: '#E0E0E0',
        red: '#D93C3C',
        text: '#272727',
        gradient: 'linear-gradient(146.1deg, #E0E0E0 0%, #F9F9F9 100%)',
        keyBackground: '#e6e6e6'
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
    return (
        <ThemeHelperContext.Provider
            value={{
            }}
        >
            <ThemeProvider theme={themes.light}>
                {children}
            </ThemeProvider>
        </ThemeHelperContext.Provider>
    )
}