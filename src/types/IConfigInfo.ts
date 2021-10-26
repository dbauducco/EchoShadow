import { LogLevel } from './enums';

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
    mode: 'pov' | 'sideline' | 'auto' | 'default' | 'follow' | 'disc';
    listenOptions: 'same' | 'opponent' | 'both' | 'none';
    showScoresBetweenRounds: boolean;
    secondsToShowScoreBetweenRounds: number;
    keyboardAggressiveness: number;
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
