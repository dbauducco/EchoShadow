import React from 'react';
import { render } from 'react-dom';
import { ipcRenderer } from 'electron';
import { GlobalStyle } from './styles/GlobalStyle';

import Greetings from './components/Greetings/index';
import TopBarButtons from './components/TopBarButtons';
import ConfigPage from './components/ConfigPage';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'react-root');
document.body.appendChild(mainElement);

const App = () => {
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  // Function to request to open the config file
  const openConfig = () => {
    if (isConfigOpen) {
      ipcRenderer.send('close-config');
    } else {
      ipcRenderer.send('open-config');
    }
    setIsConfigOpen(!isConfigOpen);
  };

  return (
    <>
      <GlobalStyle />
      <TopBarButtons openConfig={openConfig} />
      {isConfigOpen ? <ConfigPage /> : <Greetings />}
    </>
  );
};

render(<App />, mainElement);
