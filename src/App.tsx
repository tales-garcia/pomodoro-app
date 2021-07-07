import React from 'react'
import 'react-circular-progressbar/dist/styles.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { render } from 'react-dom'
import { ThemeProvider } from 'styled-components'
import { ModalProvider } from './hooks/modal';
import { WorkspaceProvider } from './hooks/workspace';
import Routes from './Routes';
import { GlobalStyle } from './styles/GlobalStyle'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
const windowTopBar = document.createElement('span')
windowTopBar.setAttribute('style', 'width: 100%; height: 36px; -webkit-app-region: drag; display: block;')
document.body.appendChild(windowTopBar)
document.body.appendChild(mainElement)

const theme = {
  blue: '#24243B',
  darkBlue: '#151423',
  red: '#D93C3C',
  text: '#E4E4E4'
}

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ModalProvider>
          <WorkspaceProvider>
            <Routes />
          </WorkspaceProvider>
        </ModalProvider>
      </ThemeProvider>
    </DndProvider>
  )
}

render(<App />, mainElement)
