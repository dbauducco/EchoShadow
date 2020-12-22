import { IEchoMatchData, IEchoCameraController } from '../types';
import { keyboard } from '../utilities';

export default class SidelineCameraController implements IEchoCameraController {
  update(matchData: IEchoMatchData) {}

  getDefault(matchData: IEchoMatchData) {
    keyboard.type('s');
  }
}
