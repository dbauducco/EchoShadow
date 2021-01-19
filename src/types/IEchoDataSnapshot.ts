import { EchoSessionType } from './EchoSessionType';
import { IEchoMatchPlayerData } from './IEchoMatchPlayerData';

export interface IEchoDataSnapshot {
  sessionId: string;
  sessionType: EchoSessionType;
  inMatch: boolean;
  client: IEchoMatchPlayerData;
  blueTeamMembers: IEchoMatchPlayerData[];
  orangeTeamMembers: IEchoMatchPlayerData[];
  spectatorMembers: IEchoMatchPlayerData[];
}
