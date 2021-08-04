import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    blue: string,
    darkBlue: string,
    red: string,
    text: string,
    gradient: string,
    keyBackground: string,
    switchBackground: string
  }
}