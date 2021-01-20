import {
  EventType,
  IConfigInfo,
  IEchoDataRepository,
  IEchoMatchData,
} from '../types';
import http from 'http';
import Events from '../utilities/Events';
import { ShadowStateType } from '../types/ShadowStateType';

export default class SpectatorManager {
  endpointPort: number = 1010;
  dataRepository: IEchoDataRepository | undefined;

  constructor(
    private configData: IConfigInfo,
    private remoteDataRepository: IEchoDataRepository
  ) {
    this.dataRepository = remoteDataRepository;
    this.endpointPort = parseInt(configData.redirectAPI.serverPort);
    this.startRedirect();
    Events.emit(EventType.NewShadowState, ShadowStateType.RunningRedirect);
  }

  public startRedirect() {
    http
      .createServer(async (req, res) => {
        if (this.dataRepository) {
          const remoteData = await this.dataRepository.getInstantRawSnapshot();
          res.write(JSON.stringify(remoteData));
          res.end();
        }
      })
      .listen(this.endpointPort);
  }
}
