import { IEchoMatchData } from '../types';
import { IEchoCameraController } from '../types/IEchoCameraController';
import * as robotjs from 'robotjs';

export default class DoNothingCameraController
  implements IEchoCameraController {
  update(matchData: IEchoMatchData, keyboard: typeof robotjs) {
    return;
  }
  getDefault(matchData: IEchoMatchData, keyboard: typeof robotjs) {
    return;
  }
}
