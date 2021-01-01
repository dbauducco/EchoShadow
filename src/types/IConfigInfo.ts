import { LogLevel } from './LogLevel';

export interface IConfigInfo {
  echoPath: string;
  remoteApiIpAddress: string;
  localApiIpAddress: string;
  logLevel: LogLevel;
  debugUI: boolean;
  hideUIOnJoin: boolean;
  spectateCameraOption: string;
}
