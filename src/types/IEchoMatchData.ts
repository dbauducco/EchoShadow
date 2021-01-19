import { EchoSessionType } from './EchoSessionType';
import { IEchoMatchPlayerData } from './IEchoMatchPlayerData';

export interface IEchoMatchData {
  sessionType: EchoSessionType;
  sessionID: string;
  discPosition: number[];
  remote: {
    inMatch: boolean;
    index: number;
    name: string;
    team: string;
  };
  local: {
    inMatch: boolean;
    team: string;
    name: string;
    position: number[];
    forward: number[];
    up: number[];
    left: number[];
  };
  game: {
    disc: number[];
    bluePlayers: IEchoMatchPlayerData[];
    orangePlayers: IEchoMatchPlayerData[];
  };
}
