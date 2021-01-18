import React from 'react';
import { remote, ipcRenderer } from 'electron';
import ReactTooltip from 'react-tooltip';

import { TopRightContainer, InvisibleButton } from './styles';
import CloseSVG from '../../assets/close.svg';
import SettingsSVG from '../../assets/settings.svg';
import Portal from '../Utils/Portal';

// Function to close the EchoShadowWindow
const closeEchoShadow = () => {
  const currentWindow = remote.BrowserWindow.getFocusedWindow();
  if (currentWindow) {
    currentWindow.close();
  }
};

const TopBarButtons: React.FC = () => {
  const [isOn, setOn] = React.useState(false); // toggles button visibility
  // Function to request to open the config file
  const openConfigFile = () => {
    setOn(!isOn);
    // ipcRenderer.send('open-config');
  };
  return (
    <>
      <TopRightContainer>
        <InvisibleButton
          data-tip
          data-for="settingsTip"
          onClick={openConfigFile}
        >
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
      <div>
        {isOn && (
          <Portal>
            <div>
              Awesome content that is never cut off by its parent container!
            </div>
          </Portal>
        )}
      </div>
    </>
  );
};

export default TopBarButtons;
