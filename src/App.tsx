import React from 'react'
import 'react-circular-progressbar/dist/styles.css';
import { render } from 'react-dom'
import { ThemeProvider } from 'styled-components'
import Clock from './components/Clock'
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
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Routes/>
    </ThemeProvider>
  )
}

render(<App />, mainElement)
