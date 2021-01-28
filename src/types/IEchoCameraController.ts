import SpectatorManager from '../managers/SpectatorManager';
import { IEchoMatchData } from './IEchoMatchData';

export interface IEchoCameraController {
  update(matchData: IEchoMatchData, spectatorManager: SpectatorManager): void;
  getDefault(
    matchData: IEchoMatchData,
    spectatorManager: SpectatorManager
  ): void;
}
