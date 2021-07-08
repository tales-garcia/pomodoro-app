import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from 'styled-components'
import { ModalProvider } from '../hooks/modal';
import { WorkspaceProvider } from '../hooks/workspace';
import { GlobalStyle } from '../styles/GlobalStyle'

const theme = {
    blue: '#24243B',
    darkBlue: '#151423',
    red: '#D93C3C',
    text: '#E4E4E4'
}

const AppProvider: React.FC = ({ children }) => {
    return (
        <DndProvider backend={HTML5Backend}>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                <ModalProvider>
                    <WorkspaceProvider>
                        {children}
                    </WorkspaceProvider>
                </ModalProvider>
            </ThemeProvider>
        </DndProvider>
    );
}

export default AppProvider;