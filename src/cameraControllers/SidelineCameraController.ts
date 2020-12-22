import { IEchoMatchData } from '../types';
import { IEchoCameraController } from '../types/IEchoCameraController';
import * as robotjs from 'robotjs';

export default class SidelineCameraController implements IEchoCameraController {
  update(matchData: IEchoMatchData, keyboard: typeof robotjs) {}
  getDefault(matchData: IEchoMatchData, keyboard: typeof robotjs) {
    robotjs.keyTap('s');
  }
}
