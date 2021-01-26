import { IEchoMatchData, IEchoCameraController } from '../types';
import { keyboard, sleep } from '../utilities';

export default class SidelineCameraController implements IEchoCameraController {
  update(matchData: IEchoMatchData) {}

  async getDefault(matchData: IEchoMatchData) {
    keyboard.type('s');
    await sleep(1000);
    keyboard.type('s');
    await sleep(1000);
    keyboard.type('s');
  }
}
