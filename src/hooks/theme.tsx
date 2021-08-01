import React, { createContext, useContext } from 'react';
import { ThemeProvider } from 'styled-components';

interface ThemeHelperContextContent {
}

const themes = {
    dark: {
        blue: '#24243B',
        darkBlue: '#151423',
        red: '#D93C3C',
        text: '#E4E4E4'
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
            <ThemeProvider theme={themes.dark}>
                {children}
            </ThemeProvider>
        </ThemeHelperContext.Provider>
    )
}