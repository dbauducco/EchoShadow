import * as React from 'react';
import { IConfigInfo } from '../../../src/types';
import { Config } from '../../../src/utilities/Config';

const ConfigPage = () => {
  const config = new Config();
  const [configData, setConfigData] = React.useState<IConfigInfo>();

  React.useEffect(() => {
    const readTheConfig = async () => {
      const readConfig = await config.readConfig();
      setConfigData(readConfig);
    };
    readTheConfig();
  });

  if (configData) {
    return <div>echoPath: {configData.echoPath}</div>;
  }

  return <div />;
};

export default ConfigPage;
