import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    color: #E1E1E6;
    background: linear-gradient(146.1deg, #1D1C30 0%, #31314E 100%);
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
`
