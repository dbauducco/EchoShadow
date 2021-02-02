import EchoVRClient from '../clients/EchoVRClient';
import { IEchoMatchData, IEchoSpectatorController } from '../types';

export default class SidelineSpectatorController
  implements IEchoSpectatorController {
  private hasRequestedSideline = false;

  constructor(private echoVrClient: EchoVRClient) {}

  update(matchData: IEchoMatchData) {
    if (!this.hasRequestedSideline) {
      this.echoVrClient.requestSideline();
      this.hasRequestedSideline = true;
    }
  }
}
