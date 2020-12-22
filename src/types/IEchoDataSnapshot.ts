import { EchoSessionType } from './EchoSessionType';

export interface IEchoDataSnapshot {
  sessionId: string;
  sessionType: EchoSessionType;
  clientName: string;
  inMatch: boolean;
  blueTeamMembers: string[];
  orangeTeamMembers: string[];
  spectatorMembers: string[];
}
