import * as React from 'react';
import styled from 'styled-components';
import { IConfigInfo } from '../../../../src/types';

const ConfigData: React.FC<{ configData: IConfigInfo }> = ({ configData }) => {
  const [questIP, setQuestIP] = React.useState(configData.network.questIP);
  const [questPort, setQuestPort] = React.useState(
    configData.network.questPort
  );
  const [localIP, setLocalIP] = React.useState(configData.network.localIP);
  const [localPort, setLocalPort] = React.useState(
    configData.network.localPort
  );

  return (
    <Section>
      <SectionHeader>Network</SectionHeader>
      <Label>
        questIP
        <Input
          type="text"
          name="questIP"
          value={questIP}
          onChange={e => setQuestIP(e.target.value)}
        />
      </Label>
      <Label>
        questPort
        <Input
          type="text"
          name="questPort"
          value={questPort}
          onChange={e => setQuestPort(e.target.value)}
        />
      </Label>
      <Label>
        localIP
        <Input
          type="text"
          name="localIP"
          value={localIP}
          onChange={e => setLocalIP(e.target.value)}
        />
      </Label>
      <Label>
        localPort
        <Input
          type="text"
          name="localPort"
          value={localPort}
          onChange={e => setLocalPort(e.target.value)}
        />
      </Label>
    </Section>
  );
};

export default ConfigData;

const Section = styled.div`
  -webkit-app-region: no-drag;
`;
const SectionHeader = styled.h2``;
const Label = styled.label``;
const Input = styled.input``;
