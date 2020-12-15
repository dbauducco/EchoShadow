import React from 'react';
import { render } from 'react-dom';
import { GlobalStyle } from './styles/GlobalStyle';

import Greetings from './components/Greetings';
import CloseButton from './components/CloseButton';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

const App = () => {
  return (
    <>
      <GlobalStyle />
      <CloseButton />
      <Greetings />
    </>
  );
};

render(<App />, mainElement);
