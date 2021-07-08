import React from 'react'
import 'react-circular-progressbar/dist/styles.css';
import { render } from 'react-dom'
import AppProvider from './hooks';
import Routes from './Routes';

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
const windowTopBar = document.createElement('span')
windowTopBar.setAttribute('style', 'width: 100%; height: 36px; -webkit-app-region: drag; display: block;')
document.body.appendChild(windowTopBar)
document.body.appendChild(mainElement)

const App = () => {
  return (
    <AppProvider>
      <Routes />
    </AppProvider>
  )
}

render(<App />, mainElement)
