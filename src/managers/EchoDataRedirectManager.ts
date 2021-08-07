import http from 'http';
import {
  EventType,
  IConfigInfo,
  IEchoDataRepository,
  ShadowStateType,
} from '../types';
import { Events } from '../utilities';

export default class EchoDataRedirectManager {
  endpointPort = 1010;

  dataRepository: IEchoDataRepository | undefined;

  constructor(
    private configData: IConfigInfo,
    private remoteDataRepository: IEchoDataRepository
  ) {
    this.dataRepository = remoteDataRepository;
    this.endpointPort = Number(configData.redirectAPI.serverPort);
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
