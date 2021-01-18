import React from 'react';
import { render } from 'react-dom';
import { GlobalStyle } from './styles/GlobalStyle';

import Greetings from './components/Greetings/index';
import TopBarButtons from './components/TopBarButtons';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'react-root');
document.body.appendChild(mainElement);

const portalElement = document.createElement('div');
portalElement.setAttribute('id', 'portal-root');
document.body.appendChild(portalElement);

const App = () => {
  return (
    <>
      <GlobalStyle />
      <TopBarButtons />
      <Greetings />
    </>
  );
};

render(<App />, mainElement);
