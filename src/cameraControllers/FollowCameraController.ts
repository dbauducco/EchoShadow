import { IEchoMatchData } from '../types';
import { IEchoCameraController } from '../types/IEchoCameraController';
import * as robotjs from 'robotjs';

export default class FollowCameraController implements IEchoCameraController {
  // Default
  getDefault(matchData: IEchoMatchData, keyboard: typeof robotjs) {
    keyboard.keyTap('' + matchData.remoteGameIndex, 'shift');
  }
  // Updating
  update(matchData: IEchoMatchData, keyboard: typeof robotjs) {}
}
