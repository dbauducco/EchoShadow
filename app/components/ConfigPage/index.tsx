import * as React from 'react';
import styled from 'styled-components';
import { IConfigInfo } from '../../../src/types';
import { Config } from '../../../src/utilities/Config';
import ConfigData from './ConfigData';

const ConfigPage = () => {
  const [configData, setConfigData] = React.useState<IConfigInfo>();

  React.useEffect(() => {
    const config = new Config();
    const readTheConfig = async () => {
      const readConfig = await config.readConfig();
      setConfigData(readConfig);
    };
    readTheConfig();
  }, []);

  return (
    <ConfigWrapper>
      <ConfigHeader>Echo Shadow Configuration</ConfigHeader>
      {configData && <ConfigData configData={configData} />}
    </ConfigWrapper>
  );
};

export default ConfigPage;

const ConfigWrapper = styled.div``;
const ConfigHeader = styled.h1`
  text-align: center;
  padding: 1.6rem 0;
`;
