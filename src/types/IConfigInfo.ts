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
    mode: 'pov' | 'sideline' | 'auto' | 'default' | 'follow';
    listenOptions: 'same' | 'opponent' | 'both' | 'none';
  };
  dev: {
    logLevel: LogLevel;
    debugUI: boolean;
  };
  redirectAPI: {
    enabled: boolean;
    serverPort: string;
  };
}
