import React from 'react';
import { TopRightButton } from './styles';
const { BrowserWindow } = require('electron').remote;

// Function to close the EchoShadowWindow
const closeEchoShadow = () => {
  console.log('SHOULD CLOSE!');
  const currentWindow = BrowserWindow.getFocusedWindow();
  currentWindow?.close();
};

const CloseButton: React.FC = () => {
  console.log('Built component!');
  return <TopRightButton onClick={closeEchoShadow}>X</TopRightButton>;
};

export default CloseButton;
