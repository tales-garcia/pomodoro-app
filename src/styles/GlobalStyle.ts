import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.gradient};
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
`
