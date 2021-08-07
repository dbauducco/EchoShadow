import React from 'react';
import { remote } from 'electron';
import ReactTooltip from 'react-tooltip';

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

const TopBarButtons: React.FC<{ openConfig: () => void }> = ({
  openConfig,
}) => {
  return (
    <TopRightContainer>
      <InvisibleButton data-tip data-for="settingsTip" onClick={openConfig}>
        <SettingsSVG height={20} width={20} fill="currentColor" />
      </InvisibleButton>
      <InvisibleButton data-tip data-for="closeTip" onClick={closeEchoShadow}>
        <CloseSVG height={15} width={15} fill="currentColor" />
      </InvisibleButton>
      <ReactTooltip id="settingsTip" place="left" effect="solid">
        Open EchoShadow Config
      </ReactTooltip>
      <ReactTooltip id="closeTip" place="left" effect="solid">
        Close EchoShadow
      </ReactTooltip>
    </TopRightContainer>
  );
};

export default TopBarButtons;
