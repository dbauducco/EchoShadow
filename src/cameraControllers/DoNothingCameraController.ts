import SpectatorManager from '../managers/SpectatorManager';
import { IEchoMatchData, IEchoCameraController } from '../types';

export default class DoNothingCameraController
  implements IEchoCameraController {
  update(matchData: IEchoMatchData, spectatorManager: SpectatorManager) {}

  getDefault(matchData: IEchoMatchData, spectatorManager: SpectatorManager) {}
}
