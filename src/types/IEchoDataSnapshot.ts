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
  discPosition: number[];
  blueTeamMembers: IEchoMatchPlayerData[];
  orangeTeamMembers: IEchoMatchPlayerData[];
  spectatorMembers: IEchoMatchPlayerData[];
}
