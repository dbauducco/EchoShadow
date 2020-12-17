import Events from '../utilities/Events';
import { IEchoDataRepository, IEchoDataSnapshot } from '../types';
import { IEchoSnapshotChangedEventData } from '../types/events/IEchoSnapshotChangedEventData';
import { EventType } from '../types/EventType';

export default class EchoDataEventManager {
  WAIT_TIME_SECONDS = 5;
  remoteDataInterval: number | undefined = undefined;
  localDataInterval: number | undefined = undefined;

  constructor(
    public localDataRepository: IEchoDataRepository,
    public remoteDataRepository: IEchoDataRepository
  ) {
    // Auto-Start
    //this.start();
  }

  /**************** GENERIC ****************/
  public start() {
    this.startRemote();
    this.startLocal();
  }

  public stop() {
    this.stopRemote();
    this.stopLocal();
  }

  /**************** REMOTE ****************/
  public startRemote() {
    this.remoteDataInterval = setInterval(
      this.updateRemote.bind(this),
      this.WAIT_TIME_SECONDS * 1000
    );
  }

  public stopRemote() {
    // Check if our interval is currently running
    if (!this.remoteDataInterval) {
      // Stop the interval and reset our local variable
      clearInterval(this.remoteDataInterval);
      this.remoteDataInterval = undefined;
    }
  }

  public async updateRemote() {
    const newSnapshot = await this.remoteDataRepository.getSnapshot();

    const eventData: IEchoSnapshotChangedEventData = {
      newSnapshot: newSnapshot,
    };
    Events.emit(EventType.RemoteSnapshotChanged, eventData);
  }

  /**************** LOCAL ****************/
  public startLocal() {
    this.localDataInterval = setInterval(
      this.updateLocal.bind(this),
      this.WAIT_TIME_SECONDS * 1000
    );
  }

  public stopLocal() {
    // Check if our interval is currently running
    if (!this.localDataInterval) {
      // Stop the interval and reset our local variable
      clearInterval(this.localDataInterval);
      this.localDataInterval = undefined;
    }
  }

  public async updateLocal() {
    const newSnapshot = await this.localDataRepository.getSnapshot();

    const eventData: IEchoSnapshotChangedEventData = {
      newSnapshot: newSnapshot,
    };
    Events.emit(EventType.LocalSnapshotChanged, eventData);
  }
}
