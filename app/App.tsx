import React from 'react';
import { render } from 'react-dom';
import { ipcRenderer } from 'electron';
import { GlobalStyle } from './styles/GlobalStyle';

import ComputerSVG from './assets/computer.svg';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'react-root');
document.body.appendChild(mainElement);

const App = () => {
  return (
    <>
      <GlobalStyle />
      <p>Hello!</p>
    </>
  );
};

render(<App />, mainElement);
