import React from 'react';
import { remote, ipcRenderer } from 'electron';

import { TopRightContainer, InvisibleButton } from './styles';
import CloseSVG from '../../assets/close.svg';
import SettingsSVG from '../../assets/settings.svg';

// Function to close the EchoShadowWindow
const closeEchoShadow = () => {
  const currentWindow = remote.BrowserWindow.getFocusedWindow();
  if (currentWindow) {
    currentWindow.close();
  }
};

// Function to request to open the config file
const openConfigFile = () => {
  ipcRenderer.send('open-config');
};

const TopBarButtons: React.FC = () => (
  <TopRightContainer>
    <InvisibleButton onClick={openConfigFile}>
      <SettingsSVG height={20} width={20} fill="currentColor" />
    </InvisibleButton>
    <InvisibleButton onClick={closeEchoShadow}>
      <CloseSVG height={15} width={15} fill="currentColor" />
    </InvisibleButton>
  </TopRightContainer>
);

export default TopBarButtons;
