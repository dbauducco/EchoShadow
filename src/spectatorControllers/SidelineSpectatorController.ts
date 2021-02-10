import EchoVRClient from '../clients/EchoVRClient';
import { IEchoMatchData, IEchoSpectatorController } from '../types';
import { sleep } from '../utilities';

export default class SidelineSpectatorController
  implements IEchoSpectatorController {
  private hasRequestedSideline = false;

  constructor(private echoVrClient: EchoVRClient) {}

  async update(matchData: IEchoMatchData) {
    if (!this.hasRequestedSideline) {
      this.echoVrClient.requestSideline();
      await sleep(2000);
      this.echoVrClient.requestSideline();
      await sleep(2000);
      this.echoVrClient.requestSideline();
      this.hasRequestedSideline = true;
    }
  }
}
