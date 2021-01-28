import EchoVRClient from '../clients/EchoVRClient';
import { IEchoMatchData, IEchoSpectatorController } from '../types';

export default class SidelineSpectatorController
  implements IEchoSpectatorController {
  constructor(private echoVrClient: EchoVRClient) {}

  update(matchData: IEchoMatchData) {
    this.echoVrClient.requestSideline();
  }
}
