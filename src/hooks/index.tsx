import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ModalProvider } from '../hooks/modal';
import { WorkspaceProvider } from '../hooks/workspace';
import { GlobalStyle } from '../styles/GlobalStyle'
import { LocalizationProvider } from './localization';
import { ThemeHelperProvider } from './theme';
import { TimerProvider } from './timer';

const AppProvider: React.FC = ({ children }) => {
    return (
        <LocalizationProvider>
            <DndProvider backend={HTML5Backend}>
                <ThemeHelperProvider>
                    <GlobalStyle />
                    <ModalProvider>
                        <WorkspaceProvider>
                            <TimerProvider>
                                {children}
                            </TimerProvider>
                        </WorkspaceProvider>
                    </ModalProvider>
                </ThemeHelperProvider>
            </DndProvider>
        </LocalizationProvider>
    );
}

export default AppProvider;