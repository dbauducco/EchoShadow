import EchoVRClient from '../clients/EchoVRClient';
import { IEchoMatchData } from '../types';
import { log } from '../utilities';

export class ListenSpectatorController {
  constructor(private echoVrClient: EchoVRClient) {}

  public async handleMutingBasedOnTeam(
    listenOptions: string,
    matchData: IEchoMatchData
  ) {
    if (listenOptions === 'both') {
      return 'listening to both';
    }
    if (listenOptions === 'none') {
      await this.echoVrClient.muteAll();
      return 'muting all';
    }
    if (matchData.remote.team === 'orange') {
      if (listenOptions === 'same') {
        await this.echoVrClient.listenOrange();
        return 'listening orange';
      }
      if (listenOptions === 'opponent') {
        await this.echoVrClient.listenBlue();
        return 'listening blue';
      }
    }
    if (listenOptions === 'same') {
      await this.echoVrClient.listenBlue();
      return 'listening blue';
    }
    if (listenOptions === 'opponent') {
      await this.echoVrClient.listenOrange();
      return 'listening orange';
    }
    log.error({
      message: 'unkown configuration and data state',
      matchData,
      listenOptions,
    });
    return 'unkown configuration and data state';
  }
}
