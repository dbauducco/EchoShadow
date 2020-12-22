import { IEchoMatchData, IEchoCameraController } from '../types';
import { keyboard } from '../utilities/utils';

export default class DiscCameraController implements IEchoCameraController {
  lastKey = '';

  // Default
  getDefault(matchData: IEchoMatchData) {
    return undefined;
  }

  // Updating
  update(matchData: IEchoMatchData) {
    const discPositionWidth = matchData.discPosition[2];
    if (discPositionWidth > 2) {
      // Orange side
      keyboard.type('4');
    } else if (discPositionWidth < -2) {
      // Blue side
      keyboard.type('7');
    } else {
      // Middle
      keyboard.type('5');
    }
  }
}
