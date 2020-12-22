import Events from '../utilities/Events';
import {
  IEchoDataRepository,
  IEchoDataSnapshot,
  IEchoNewSnapshotEventData,
} from '../types';
import { EventType } from '../types/EventType';

export default class EchoDataEventManager {
  WAIT_TIME_SECONDS = 3;
  updateShouldRun = false;

  constructor(
    public localDataRepository: IEchoDataRepository,
    public remoteDataRepository: IEchoDataRepository
  ) {
    // Auto-Start
    //this.start();
  }

  public start() {
    this.updateShouldRun = true;
    this.update();
  }

  public stop() {
    this.updateShouldRun = false;
  }

  private async update() {
    const newRemoteSnapshot = await this.remoteDataRepository.getSnapshot();
    const newLocalSnapshot = await this.localDataRepository.getSnapshot();

    if (newRemoteSnapshot) {
      Events.emit(EventType.RemoteIsConnected);
    } else {
      Events.emit(EventType.RemoteIsDisconnected);
    }

    if (newLocalSnapshot) {
      Events.emit(EventType.LocalIsConnected);
    } else {
      Events.emit(EventType.LocalIsDisconnected);
    }

    const eventData: IEchoNewSnapshotEventData = {
      remoteSnapshot: newRemoteSnapshot,
      localSnapshot: newLocalSnapshot,
    };
    Events.emit(EventType.NewSnapshotData, eventData);

    if (this.updateShouldRun)
      setTimeout(this.update.bind(this), this.WAIT_TIME_SECONDS * 1000);
  }

  /*
  public startRemote() {
    this.remoteDataShouldRun = true;
    this.updateRemote();
  }

  public stopRemote() {
    // Check if our interval is currently running
    if (!this.remoteDataInterval) {
      // Stop the interval and reset our local variable
      clearInterval(this.remoteDataInterval);
      this.remoteDataInterval = undefined;
    }
  }

  private async updateRemote() {
    const newSnapshot = await this.remoteDataRepository.getSnapshot();

    if (newSnapshot) {
      Events.emit(EventType.RemoteIsConnected);
    } else {
      Events.emit(EventType.RemoteIsDisconnected);
    }

    const eventData: IEchoSingleSnapshotEventData = {
      newSnapshot: newSnapshot,
    };
    Events.emit(EventType.RemoteSnapshotChanged, eventData);

    if (this.remoteDataShouldRun)
      setTimeout(this.updateRemote.bind(this), this.WAIT_TIME_SECONDS * 1000);
  }

  public startLocal() {
    this.localDataShouldRun = true;
    this.updateLocal();
  }

  public stopLocal() {
    this.localDataShouldRun = false;
  }

  private async updateLocal() {
    const newSnapshot = await this.localDataRepository.getSnapshot();

    if (newSnapshot) {
      Events.emit(EventType.LocalIsConnected);
    } else {
      Events.emit(EventType.LocalIsDisconnected);
    }

    const eventData: IEchoSingleSnapshotEventData = {
      newSnapshot: newSnapshot,
    };
    Events.emit(EventType.LocalSnapshotChanged, eventData);

    if (this.localDataShouldRun)
      setTimeout(this.updateLocal.bind(this), this.WAIT_TIME_SECONDS * 1000);
  }*/
}
