import EchoVRClient from '../clients/EchoVRClient';
import { IEchoMatchData, IEchoSpectatorController } from '../types';
import { log } from '../utilities';

export default class DiscSpectatorController
  implements IEchoSpectatorController {
  constructor(private echoVrClient: EchoVRClient) {}

  lastKey: number | undefined = undefined;

  // Default
  async getDefault(matchData: IEchoMatchData) {
    this.echoVrClient.requestAPIMode();
    return undefined;
  }

  // Updating
  async update(matchData: IEchoMatchData) {
    const discPositionWidth = matchData.discPosition[2];
    console.log(discPositionWidth);
    if (discPositionWidth > 2) {
      // Orange side
      await this.goToCameraKey(4);
    } else if (discPositionWidth < -2) {
      // Blue side
      await this.goToCameraKey(7);
    } else {
      // Middle
      await this.goToCameraKey(5);
    }
  }

  public async goToCameraKey(key: number) {
    if (this.lastKey !== key) {
      console.log('Going to camera ' + key);
      this.lastKey = key;
      this.echoVrClient.requestCameraByIndex(key);
    }
  }
}
