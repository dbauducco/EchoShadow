import {
  EchoSessionType,
  IEchoDataSnapshot,
  IEchoSnapshotOverviewsEventData,
  IEchoNewSnapshotEventData,
} from '../types';
import Events from '../utilities/Events';
import { EventType } from '../types/EventType';
import { ShadowStateType } from '../types/ShadowStateType';

export default class ShadowEventManager {
  WAIT_TIME_SECONDS = 5;

  constructor() {
    Events.on(EventType.NewSnapshotData, this.checkSync.bind(this));
  }

  /*
  public async newLocalSnapshot(snapshots: IEchoSingleSnapshotEventData) {
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
    this.checkSync();
  }

  public async newRemoteSnapshot(snapshots: IEchoSingleSnapshotEventData) {
    this.currentData.newRemoteSnapshot = snapshots.newSnapshot;

    // Check if new shapshot is undefined
    if (!this.currentData.newRemoteSnapshot) {
      this.currentState = ShadowStateType.WaitingForRemoteData;
    } // Check if new shapshot is not in match
    else if (!this.inMatch(this.currentData.newRemoteSnapshot)) {
      this.currentState = ShadowStateType.WaitingForRemoteMatch;
    }

    // Check if remote instance joined a match
    if (
      this.joinedANewMatch(
        this.currentData.oldRemoteSnapshot,
        this.currentData.newRemoteSnapshot
      )
    ) {
      Events.emit(EventType.RemoteJoinedMatch, this.currentData);
    }

    // Check if remote instance left a match
    if (
      this.leftAMatch(
        this.currentData.oldRemoteSnapshot,
        this.currentData.newRemoteSnapshot
      )
    ) {
      Events.emit(EventType.RemoteLeftMatch, this.currentData);
    }

    this.currentData.oldRemoteSnapshot = snapshots.newSnapshot;
    this.checkSync();
  } */

  /** Sync Checkers * */
  public checkSync(data: IEchoNewSnapshotEventData) {
    // Check if local and remote are in matches
    if (data.localSnapshot?.inMatch && data.remoteSnapshot?.inMatch) {
      if (data.localSnapshot.sessionId === data.remoteSnapshot.sessionId) {
        // Our local instance is synced with the remote
        Events.emit(EventType.LocalIsSynced, data);
        Events.emit(EventType.NewShadowState, ShadowStateType.SyncedWithRemote);
      } else {
        // Our local instance is somehow unsycned with the remote
        Events.emit(EventType.LocalIsUnsynced, data);
      }

      if (data.remoteSnapshot && !data.remoteSnapshot.inMatch) {
        // We are currently waiting for the remote to join a match
        Events.emit(
          EventType.NewShadowState,
          ShadowStateType.WaitingForRemoteMatch
        );
      }
    } else if (!data.remoteSnapshot) {
      Events.emit(
        EventType.NewShadowState,
        ShadowStateType.WaitingForRemoteData
      );
    }
  }

  /*
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
  */
}
