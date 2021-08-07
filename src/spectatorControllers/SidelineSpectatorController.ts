import EchoVRClient from '../clients/EchoVRClient';
import { IEchoMatchData, IEchoSpectatorController } from '../types';
import { sleep } from '../utilities';

export default class SidelineSpectatorController
  implements IEchoSpectatorController {
  private hasRequestedSideline = false;

  constructor(private echoVrClient: EchoVRClient) {}

  // Default
  async getDefault(matchData: IEchoMatchData) {
    return undefined;
  }

  async update(matchData: IEchoMatchData) {
    if (!this.hasRequestedSideline) {
      this.echoVrClient.requestSideline();
      this.hasRequestedSideline = true;
    }
  }
}
