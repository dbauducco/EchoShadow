import { IEchoMatchData } from '../types';
import { IEchoCameraController } from '../types/IEchoCameraController';
import * as robotjs from 'robotjs';

export default class POVCameraController implements IEchoCameraController {
  // Default camera setup
  getDefault(matchData: IEchoMatchData, keyboard: typeof robotjs) {
    keyboard.keyTap('' + matchData.remoteGameIndex, 'shift');
    keyboard.keyTap('p');
  }
  // Updating camera setup
  update(matchData: IEchoMatchData, keyboard: typeof robotjs) {}
}
