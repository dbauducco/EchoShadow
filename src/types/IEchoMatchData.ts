import { EchoSessionType } from './EchoSessionType';

export interface IEchoMatchData {
  sessionType: EchoSessionType;
  isRemoteInMatch: boolean;
  isLocalInMatch: boolean;
  sessionID: string;
  remoteName: string;
  localName: string;
}
