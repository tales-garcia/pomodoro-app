import React from 'react'
import { render } from 'react-dom'
import { GlobalStyle } from './styles/GlobalStyle'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
const windowTopBar = document.createElement('span')
windowTopBar.setAttribute('style', 'width: 100%; height: 36px; -webkit-app-region: drag; display: block;')
document.body.appendChild(windowTopBar)
document.body.appendChild(mainElement)

const App = () => {
  return (
    <>
      <GlobalStyle />
      <div>Hello</div>
    </>
  )
}

render(<App />, mainElement)
