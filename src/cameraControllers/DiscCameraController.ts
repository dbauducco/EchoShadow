import { IEchoMatchData, IEchoCameraController } from '../types';
import { focusWindow, Key, keyboard, log } from '../utilities';

export default class DiscCameraController implements IEchoCameraController {
  lastKey: Key | undefined = undefined;

  // Default
  async getDefault(matchData: IEchoMatchData) {
    return undefined;
  }

  // Updating
  async update(matchData: IEchoMatchData) {
    const discPositionWidth = matchData.discPosition[2];
    log.info(discPositionWidth);
    if (discPositionWidth > 2) {
      // Orange side
      await this.goToCameraKey(Key.Num4);
    } else if (discPositionWidth < -2) {
      // Blue side
      await this.goToCameraKey(Key.Num7);
    } else {
      // Middle
      await this.goToCameraKey(Key.Num5);
    }
  }

  public async goToCameraKey(key: Key) {
    if (this.lastKey != key) {
      this.lastKey = key;
      await keyboard.pressKey(Key.LeftControl, key);
      setTimeout(function () {
        keyboard.releaseKey(Key.LeftControl, key);
      }, 1000);
    }
  }
}
