import { IEchoMatchData } from './IEchoMatchData';

export interface IEchoSpectatorController {
  update(matchData: IEchoMatchData): void;
}
