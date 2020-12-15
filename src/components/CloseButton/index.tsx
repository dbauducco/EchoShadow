import React from 'react';
import { TopRightButton } from './styles';
const { BrowserWindow } = require('electron').remote;

const CloseButton: React.FC = () => {
  return <TopRightButton onClick={closeEchoShadow}>X</TopRightButton>;
};

const closeEchoShadow = () => {
  const currentWindow = BrowserWindow.getFocusedWindow();
  currentWindow.close();
};

export default CloseButton;
