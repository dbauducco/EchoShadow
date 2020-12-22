import { IEchoMatchData, IEchoCameraController } from '../types';
import { keyboard, Key } from '../utilities/utils';

export default class FollowCameraController implements IEchoCameraController {
  // Default
  getDefault(matchData: IEchoMatchData) {
    const remoteGameIndexKey = (Key[
      `Num${matchData.remoteGameIndex}` as any
    ] as unknown) as Key;
    keyboard.click(remoteGameIndexKey, Key.LeftShift);
  }

  // Updating
  update(matchData: IEchoMatchData) {}
}
