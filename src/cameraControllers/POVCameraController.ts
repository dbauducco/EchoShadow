import { IEchoMatchData, IEchoCameraController } from '../types';
import { keyboard, Key } from '../utilities/utils';

export default class POVCameraController implements IEchoCameraController {
  // Default camera setup
  getDefault(matchData: IEchoMatchData) {
    const remoteGameIndexKey = (Key[
      `Num${matchData.remoteGameIndex}` as any
    ] as unknown) as Key;
    keyboard.click(remoteGameIndexKey, Key.LeftShift);
    keyboard.click(Key.P);
  }

  // Updating camera setup
  update(matchData: IEchoMatchData) {}
}
