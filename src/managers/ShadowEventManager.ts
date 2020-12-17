import {
  EchoSessionType,
  IEchoDataSnapshot,
  IEchoMatchChangedEventData,
  IEchoSnapshotChangedEventData,
} from '../types';
import { log } from '../utilities/log';
import Events from '../utilities/Events';
import { EventType } from '../types/EventType';

export default class ShadowEventManager {
  WAIT_TIME_SECONDS = 5;
  localTimedOutCounter = 0;
  currentInterval: number | undefined = undefined;
  currentData: IEchoMatchChangedEventData;

  constructor() {
    // Creating current data to be empty
    this.currentData = {
      newRemoteSnapshot: undefined,
      newLocalSnapshot: undefined,
      oldRemoteSnapshot: undefined,
      oldLocalSnapshot: undefined,
    };

    Events.on(EventType.LocalSnapshotChanged, this.newLocalSnapshot.bind(this));
    Events.on(
      EventType.RemoteSnapshotChanged,
      this.newRemoteSnapshot.bind(this)
    );
  }

  public async newLocalSnapshot(snapshots: IEchoSnapshotChangedEventData) {
    this.currentData.newLocalSnapshot = snapshots.newSnapshot;

    // Check if local instance joined a match
    if (
      this.joinedANewMatch(
        this.currentData.oldLocalSnapshot,
        this.currentData.newLocalSnapshot
      )
    ) {
      Events.emit(EventType.LocalJoinedMatch, this.currentData);
    }

    // Check if local instance left a match
    if (
      this.leftAMatch(
        this.currentData.oldLocalSnapshot,
        this.currentData.newLocalSnapshot
      )
    ) {
      Events.emit(EventType.LocalLeftMatch, this.currentData);
    }

    this.currentData.oldLocalSnapshot = snapshots.newSnapshot;
  }

  public async newRemoteSnapshot(snapshots: IEchoSnapshotChangedEventData) {
    this.currentData.newRemoteSnapshot = snapshots.newSnapshot;

    // Check if local instance joined a match
    if (
      this.joinedANewMatch(
        this.currentData.oldRemoteSnapshot,
        this.currentData.newRemoteSnapshot
      )
    ) {
      Events.emit(EventType.RemoteJoinedMatch, this.currentData);
    }

    // Check if local instance left a match
    if (
      this.leftAMatch(
        this.currentData.oldRemoteSnapshot,
        this.currentData.newRemoteSnapshot
      )
    ) {
      Events.emit(EventType.RemoteLeftMatch, this.currentData);
    }

    this.currentData.oldRemoteSnapshot = snapshots.newSnapshot;
  }

  /** State Change Checkers **/
  private joinedANewMatch(
    oldSnapshot: IEchoDataSnapshot | undefined,
    newSnapshot: IEchoDataSnapshot | undefined
  ) {
    if (!this.inMatch(oldSnapshot) && this.inMatch(newSnapshot)) {
      return true;
    }

    if (oldSnapshot && newSnapshot) {
      return oldSnapshot.sessionId != newSnapshot.sessionId;
    }

    return false;
  }

  private leftAMatch(
    oldSnapshot: IEchoDataSnapshot | undefined,
    newSnapshot: IEchoDataSnapshot | undefined
  ) {
    if (this.inMatch(oldSnapshot) && !this.inMatch(newSnapshot)) {
      return true;
    }

    if (oldSnapshot && newSnapshot) {
      return oldSnapshot.sessionId != newSnapshot.sessionId;
    }

    return false;
  }

  /** General Helper Methods **/
  private inMatch(snapshot: IEchoDataSnapshot | undefined) {
    if (!snapshot) {
      return false;
    }

    return this.isJoinable(snapshot.sessionType);
  }

  private isJoinable(sessionType: EchoSessionType) {
    return (
      sessionType === EchoSessionType.Arena_Match ||
      sessionType === EchoSessionType.Private_Arena_Match
    );
  }
}
