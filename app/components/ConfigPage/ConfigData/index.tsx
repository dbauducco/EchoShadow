import * as React from 'react';
import styled from 'styled-components';
import { IConfigInfo, LogLevel } from '../../../../src/types';
import { Config } from '../../../../src/utilities';

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
      spectatorOptions: { hideUI, mode, listenOptions },
      dev: { logLevel, debugUI },
      redirectAPI: { enabled, serverPort },
    };
    await new Config().put(newConfig);
  };

  return (
    <ConfigDataForm onSubmit={handleSubmit}>
      <Section>
        <SectionHeader>Network</SectionHeader>
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
      </Section>
      <Section>
        <SectionHeader>Spectator Options</SectionHeader>
        <Label>
          Hide UI
          <Input
            type="checkbox"
            name="hideUI"
            value="hideUI"
            checked={hideUI}
            onChange={e => setHideUI(e.target.checked)}
          />
        </Label>
        <Label>
          Camera Mode
          <Select value={mode} onChange={e => setMode(e.target.value as 'pov')}>
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
      </Section>
      <Section>
        <SectionHeader>Redirect API</SectionHeader>
        <Label>
          Enabled
          <Input
            type="checkbox"
            name="enabled"
            value="enabled"
            checked={enabled}
            onChange={e => setEnabled(e.target.checked)}
          />
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
      </Section>
      <Section>
        <SectionHeader>Developer Options</SectionHeader>
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
        <Label>
          Debug UI
          <Input
            type="checkbox"
            name="debugUI"
            value="debugUI"
            checked={debugUI}
            onChange={e => setDebugUI(e.target.checked)}
          />
        </Label>
      </Section>
      <Section>
        <SectionHeader>Miscellaneous</SectionHeader>
        <Label>
          Echo Path
          <Input
            type="text"
            name="echoPath"
            value={echoPath}
            onChange={e => setEchoPath(e.target.value)}
          />
        </Label>
      </Section>
      <SaveButton type="submit" value="Save" />
    </ConfigDataForm>
  );
};

export default ConfigData;

const ConfigDataForm = styled.form`
  -webkit-app-region: no-drag;
`;
const Section = styled.div``;
const SectionHeader = styled.h2``;
const Label = styled.label``;
const Input = styled.input``;
const Select = styled.select``;
const Option = styled.option``;
const SaveButton = styled.input``;
