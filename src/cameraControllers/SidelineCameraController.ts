import SpectatorManager from '../managers/SpectatorManager';
import { IEchoMatchData, IEchoCameraController } from '../types';
import { keyboard, sleep } from '../utilities';

export default class SidelineCameraController implements IEchoCameraController {
  update(matchData: IEchoMatchData, spectatorManager: SpectatorManager) {}

  async getDefault(
    matchData: IEchoMatchData,
    spectatorManager: SpectatorManager
  ) {
    keyboard.type('s');
    await sleep(1000);
    keyboard.type('s');
    await sleep(1000);
    keyboard.type('s');
  }
}
