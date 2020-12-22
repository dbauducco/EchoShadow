import { IEchoMatchData } from '../types';
import { IEchoCameraController } from '../types/IEchoCameraController';
import * as robotjs from 'robotjs';
import { TouchBarScrubber } from 'electron';

export default class DiscCameraController implements IEchoCameraController {
  lastKey = '';
  // Default
  getDefault(matchData: IEchoMatchData, keyboard: typeof robotjs) {
    return undefined;
  }
  // Updating
  update(matchData: IEchoMatchData, keyboard: typeof robotjs) {
    const discPositionWidth = matchData.discPosition[2];
    if (discPositionWidth > 2) {
      // Orange side
      this.type('4', keyboard);
    } else if (discPositionWidth < -2) {
      // Blue side
      this.type('7', keyboard);
    } else {
      // Middle
      this.type('5', keyboard);
    }
  }

  private type(key: string, keyboard: typeof robotjs) {
    keyboard.keyTap(key);
  }
}
