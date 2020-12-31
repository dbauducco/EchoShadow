import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    color: #bdb9c9;
    margin: 0; 
    width: 100vw; 
    height: 100vh;
    -webkit-app-region: drag;
  }
`;

/* Text color:
Regular: color: #bdb9c9;
Pink Mode: color: #282436;
 */

export const theme = {
  lightGrey: 'hsl(150, 20%, 40%)',
  offWhite: 'hsl(150, 40%, 96%)',
  primary: 'hsl(150, 50%, 40%)',
  primaryBackground: 'hsl(150,39%,96%)',
  primaryBlack: 'hsl(150, 20%, 20%)',
  primaryDark: 'hsl(150, 39%, 27%)',
  primaryGrey: 'hsl(150, 6%, 31%)',
  primaryLight: 'hsl(149, 32%, 85%)',
  primaryLink: 'hsl(150, 80%, 28%)',
  secondary: 'hsl(266, 55%, 35%)',
  secondaryBackground: 'hsl(268, 48%, 95%)',
  secondaryBlack: 'hsl(266, 20%, 20%)',
  secondaryGrey: 'hsl(266, 6%, 31%)',
  secondaryLight: 'hsl(266, 32%, 85%)',
  secondaryMiddle: 'hsl(266, 33%, 55%)',
  success: 'hsl(154, 90%, 41%)',
  warning: 'hsl(0, 100%, 37%)',
  white: 'hsl(0, 0%, 100%)',
};
