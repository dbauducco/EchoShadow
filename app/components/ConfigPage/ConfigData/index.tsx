import * as React from 'react';
import styled from 'styled-components';
import { remote } from 'electron';
import { IConfigInfo, LogLevel } from '../../../../src/types';
import { Config } from '../../../../src/utilities';
import Checkbox from '../../Checkbox';

const ConfigData: React.FC<{ configData: IConfigInfo }> = ({ configData }) => {
  const [questIP, setQuestIP] = React.useState(configData.network.questIP);
  const [questPort, setQuestPort] = React.useState(
    configData.network.questPort
  );
  const [localIP, setLocalIP] = React.useState(configData.network.localIP);
  const [localPort, setLocalPort] = React.useState(
    configData.network.localPort
  );
  const [hideUI, setHideUI] = React.useState(
    configData.spectatorOptions.hideUI
  );
  const [mode, setMode] = React.useState(configData.spectatorOptions.mode);
  const [listenOptions, setListenOptions] = React.useState(
    configData.spectatorOptions.listenOptions
  );
  const [showScoresBetweenRounds, setShowScoresBetweenRounds] = React.useState(
    configData.spectatorOptions.showScoresBetweenRounds
  );
  const [
    secondsToShowScoreBetweenRounds,
    setSecondsToShowScoreBetweenRounds,
  ] = React.useState(
    configData.spectatorOptions.secondsToShowScoreBetweenRounds
  );
  const [keyboardAggressiveness, setKeyboardAgressiveness] = React.useState(
    configData.spectatorOptions.keyboardAggressiveness
  );
  const [logLevel, setLogLevel] = React.useState(configData.dev.logLevel);
  const [debugUI, setDebugUI] = React.useState(configData.dev.debugUI);
  const [enabled, setEnabled] = React.useState(configData.redirectAPI.enabled);
  const [serverPort, setServerPort] = React.useState(
    configData.redirectAPI.serverPort
  );
  const [echoPath, setEchoPath] = React.useState(configData.echoPath);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newConfig = {
      configVersion: 'v2',
      echoPath,
      network: { questIP, questPort, localIP, localPort },
      spectatorOptions: {
        hideUI,
        mode,
        listenOptions,
        showScoresBetweenRounds,
        secondsToShowScoreBetweenRounds,
        keyboardAggressiveness,
      },
      dev: { logLevel, debugUI },
      redirectAPI: { enabled, serverPort },
    };
    await new Config().put(newConfig);
    // Show confirmation dialog
    const options = {
      type: 'info',
      buttons: ['Okay'],
      title: 'Echo Shadow',
      message: 'Settings saved. Restart Echo Shadow to apply changes.',
    };
    remote.dialog.showMessageBoxSync(remote.getCurrentWindow(), options);
  };

  return (
    <ConfigDataForm onSubmit={handleSubmit}>
      <Section>
        <SectionHeader>Network</SectionHeader>
        <Inputs>
          <Label>
            Quest IP
            <Input
              type="text"
              name="questIP"
              value={questIP}
              onChange={e => setQuestIP(e.target.value)}
            />
          </Label>
          <Label>
            Quest Port
            <Input
              type="text"
              name="questPort"
              value={questPort}
              onChange={e => setQuestPort(e.target.value)}
            />
          </Label>
          <Label>
            Local IP
            <Input
              type="text"
              name="localIP"
              value={localIP}
              onChange={e => setLocalIP(e.target.value)}
            />
          </Label>
          <Label>
            Local Port
            <Input
              type="text"
              name="localPort"
              value={localPort}
              onChange={e => setLocalPort(e.target.value)}
            />
          </Label>
        </Inputs>
      </Section>
      <Section>
        <SectionHeader>Spectator Options</SectionHeader>
        <Inputs>
          <Label>
            <FormCheckbox
              checked={hideUI}
              onChange={e => setHideUI(e.target.checked)}
            />
            Hide UI
          </Label>
          <Label>
            Camera Mode
            <Select
              value={mode}
              onChange={e => setMode(e.target.value as 'pov')}
            >
              <Option value="default">Default (Auto Cam)</Option>
              <Option value="pov">POV</Option>
              <Option value="follow">Follow</Option>
              <Option value="sideline">Sideline</Option>
              <Option value="auto">Auto Cam</Option>
            </Select>
          </Label>
          <Label>
            Listen Options
            <Select
              value={listenOptions}
              onChange={e => setListenOptions(e.target.value as 'same')}
            >
              <Option value="same">Listen To Same Team Only</Option>
              <Option value="opponent">Listen To Opponents Only</Option>
              <Option value="both">Listen To Both Teams</Option>
              <Option value="none">Mute Both Teams</Option>
            </Select>
          </Label>
        </Inputs>
        <Inputs>
          <Label>
            <FormCheckbox
              checked={showScoresBetweenRounds}
              onChange={e => setShowScoresBetweenRounds(e.target.checked)}
            />
            Show Scores Between Rounds
          </Label>
          <Label>
            Seconds To Show Score Between Rounds
            <Input
              type="number"
              name="secondsToShowScoreBetweenRounds"
              value={secondsToShowScoreBetweenRounds}
              onChange={e =>
                setSecondsToShowScoreBetweenRounds(Number(e.target.value || 0))
              }
            />
          </Label>
        </Inputs>
        <Inputs>
          <Label>
            Keyboard Emulation Aggressiveness
            <Select
              value={keyboardAggressiveness}
              onChange={e =>
                setKeyboardAgressiveness(Number(e.target.value || 1))
              }
            >
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
              <Option value={3}>3</Option>
              <Option value={4}>4</Option>
              <Option value={5}>5</Option>
            </Select>
          </Label>
        </Inputs>
      </Section>
      <Section>
        <SectionHeader>Redirect API</SectionHeader>
        <Inputs>
          <Label>
            <FormCheckbox
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
            />
            Redirect API Enabled
          </Label>
          <Label>
            Server Port
            <Input
              type="text"
              name="serverPort"
              value={serverPort}
              onChange={e => setServerPort(e.target.value)}
            />
          </Label>
        </Inputs>
      </Section>
      <Section>
        <SectionHeader>Developer Options</SectionHeader>
        <Inputs>
          <Label>
            <FormCheckbox
              checked={debugUI}
              onChange={e => setDebugUI(e.target.checked)}
            />
            Debug UI
          </Label>
          <Label>
            Log Level
            <Select
              value={logLevel}
              onChange={e => setLogLevel(e.target.value as LogLevel)}
            >
              <Option value="error">Error</Option>
              <Option value="warn">Warn</Option>
              <Option value="info">Info</Option>
              <Option value="http">Http</Option>
              <Option value="verbose">Verbose</Option>
              <Option value="debug">Debug</Option>
              <Option value="silly">Silly</Option>
            </Select>
          </Label>
        </Inputs>
      </Section>
      <Section>
        <SectionHeader>Miscellaneous</SectionHeader>
        <EchoPathLabel>
          Echo Path
          <EchoPathInput
            type="text"
            name="echoPath"
            value={echoPath}
            onChange={e => setEchoPath(e.target.value)}
          />
        </EchoPathLabel>
      </Section>
      <SaveButton type="submit" value="Save Changes" />
    </ConfigDataForm>
  );
};

export default ConfigData;

const ConfigDataForm = styled.form`
  -webkit-app-region: no-drag;
  display: flex;
  flex-direction: column;
  margin: 0 0 0 0;
  *:focus {
    outline-color: #8a84a3;
  }
`;

const Section = styled.div`
  padding: 0 0 0.8rem 0;
  &:nth-child(odd) {
    background: hsl(255deg 22% 14%);
  }
`;
const SectionHeader = styled.h2`
  padding: 1.6rem 0.8rem 0.4rem 3.2rem;
`;
const Inputs = styled.div`
  display: flexbox;
  justify-content: top;
`;
const Label = styled.label`
  display: inline-block;
  padding: 0.8rem 3.2rem;
  font-weight: 600;
`;
const Input = styled.input`
  display: block;
  color: #8a84a3;
  font-size: 15px;
  background-color: hsl(253deg 22% 9%);
  border-radius: 10px;
  padding: 8px 10px 8px 10px;
  border: none;
  margin: 0.4rem 0 0 0;
  box-shadow: rgb(69 50 93 / 11%) 0px 4px 6px, rgb(0 0 0 / 8%) 0px 1px 3px;
`;
const Select = styled.select`
  display: block;
  color: #8a84a3;
  font-size: 15px;
  background-color: hsl(253deg 22% 9%);
  border-radius: 10px;
  padding: 8px 10px 8px 10px;
  border: none;
  margin: 0.4rem 0 0 0;
  box-shadow: rgb(69 50 93 / 11%) 0px 4px 6px, rgb(0 0 0 / 8%) 0px 1px 3px;
`;
const Option = styled.option`
  color: #8a84a3;
  font-size: 15px;
  background-color: hsl(253deg 22% 9%);
  border-radius: 10px;
  padding: 8px 10px 8px 10px;
  border: none;
`;
// option {
//   background: #ffffff;
//   color: #ff0000;
// }
// &:focused {
//   background-color: #8a84a3;
// }
const SaveButton = styled.input`
  color: #8a84a3;
  font-size: 20px;
  background-color: hsl(253deg 22% 9%);
  border-radius: 10px;
  padding: 12px 12px 12px 12px;
  border: none;
  align-self: center;
  margin: 1.6rem 0 3.2rem 0;
  box-shadow: rgb(69 50 93 / 11%) 0px 4px 6px, rgb(0 0 0 / 8%) 0px 1px 3px;
  cursor: pointer;
  &:hover {
    background-color: black;
  }
`;
const FormCheckbox = styled(Checkbox)`
  display: inline;
  margin: 0 0.4rem 0 0;
`;
const EchoPathLabel = styled(Label)`
  width: 90%;
`;
const EchoPathInput = styled(Input)`
  width: 90%;
`;
