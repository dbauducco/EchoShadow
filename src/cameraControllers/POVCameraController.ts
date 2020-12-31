import { IEchoMatchData, IEchoCameraController } from '../types';
import { keyboard, Key } from '../utilities/utils';

export default class POVCameraController implements IEchoCameraController {
  // Default camera setup
  getDefault(matchData: IEchoMatchData) {
    const remoteGameIndexKey = (Key[
      `Num${matchData.remoteGameIndex}` as any
    ] as unknown) as Key;
    this.goToPlayer(remoteGameIndexKey);
  }

  async goToPlayer(key: Key) {
    await keyboard.pressKey(Key.LeftShift, key);
    setTimeout(async function () {
      await keyboard.releaseKey(Key.LeftShift, key);
      await keyboard.pressKey(Key.P);
      setTimeout(async function () {
        await keyboard.releaseKey(Key.P);
      }, 1000);
    }, 1000);
  }

  // Updating camera setup
  update(matchData: IEchoMatchData) {}
}
