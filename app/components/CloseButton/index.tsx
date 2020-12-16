import React from 'react';
import { remote } from 'electron';
import { TopRightButton } from './styles';

// Function to close the EchoShadowWindow
const closeEchoShadow = () => {
  const currentWindow = remote.BrowserWindow.getFocusedWindow();
  if (currentWindow) {
    currentWindow.close();
  }
};

const CloseButton: React.FC = () => (
  <TopRightButton onClick={closeEchoShadow}>X</TopRightButton>
);

export default CloseButton;
