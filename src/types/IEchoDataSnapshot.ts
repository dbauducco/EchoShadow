import { EchoGameStatus, EchoSessionType } from './enums';
import { IEchoMatchPlayerData } from './IEchoMatchPlayerData';

export interface IEchoDataSnapshot {
  sessionId: string;
  sessionType: EchoSessionType;
  inMatch: boolean;
  game: {
    status: EchoGameStatus;
    clock: number;
  };
  client: IEchoMatchPlayerData;
  blueTeamMembers: IEchoMatchPlayerData[];
  orangeTeamMembers: IEchoMatchPlayerData[];
  spectatorMembers: IEchoMatchPlayerData[];
}
