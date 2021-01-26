import { IEchoMatchData } from './IEchoMatchData';

export interface IEchoCameraController {
  update(matchData: IEchoMatchData): void;
  getDefault(matchData: IEchoMatchData): void;
}
