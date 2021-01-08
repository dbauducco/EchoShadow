import { LogLevel } from './LogLevel';

export interface IConfigInfo {
  configVersion: string;
  echoPath: string;
  network: {
    questIP: string;
    questPort: string;
    localIP: string;
    localPort: string;
  };
  spectatorOptions: {
    hideUI: boolean;
    mode: string;
  };
  dev: {
    logLevel: LogLevel;
    debugUI: boolean;
  };
}
