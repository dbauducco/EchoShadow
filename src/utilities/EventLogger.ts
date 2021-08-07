import { IEchoMatchData, IEchoNewSnapshotEventData, EventType } from '../types';
import { log } from './log';
import { Events } from './Events';

export class EventLogger {
  constructor() {
    Events.on(
      EventType.RemoteJoinedMatch,
      this.logRemoteJoinedMatch.bind(this)
    );
    Events.on(EventType.RemoteLeftMatch, this.logRemoteLeftMatch.bind(this));
    Events.on(EventType.LocalJoinedMatch, this.logLocalJoinedMatch.bind(this));
    Events.on(EventType.LocalLeftMatch, this.logLocalLeftMatch.bind(this));
    Events.on(
      EventType.LocalWillLeaveMatch,
      this.logLocalWillLeaveMatch.bind(this)
    );
    Events.on(
      EventType.LocalWillJoinMatch,
      this.logLocalWillJoinMatch.bind(this)
    );
    Events.on(EventType.NewMatchData, this.logNewMatchData.bind(this));
    Events.on(EventType.NewSnapshotData, this.logNewSnapshotData.bind(this));
    Events.on(EventType.NewShadowState, this.logNewShadowState.bind(this));
    Events.on(EventType.LocalIsSynced, this.logLocalIsSynced.bind(this));
    Events.on(EventType.LocalIsUnsynced, this.logLocalIsUnsynced.bind(this));
    Events.on(
      EventType.RemoteChangedTeam,
      this.logRemoteChangedTeam.bind(this)
    );
  }

  private logNewSnapshotData(data: IEchoNewSnapshotEventData) {
    log.verbose({
      message: '[EventLogger] New Snapshot Data',
      event: EventType.NewSnapshotData,
      eventData: data,
    });
  }

  private logRemoteJoinedMatch(data: IEchoNewSnapshotEventData) {
    log.info({
      message: '[EventLogger] Remote Joined Match',
      event: EventType.RemoteJoinedMatch,
      eventData: data,
    });
  }

  private logRemoteLeftMatch(data: IEchoNewSnapshotEventData) {
    log.info({
      message: '[EventLogger] Remote Left Match',
      event: EventType.RemoteLeftMatch,
      eventData: data,
    });
  }

  private logLocalJoinedMatch(data: IEchoNewSnapshotEventData) {
    log.info({
      message: '[EventLogger] Local Joined Match',
      event: EventType.LocalJoinedMatch,
      eventData: data,
    });
  }

  private logLocalLeftMatch(data: IEchoNewSnapshotEventData) {
    log.info({
      message: '[EventLogger] Local Left Match',
      event: EventType.LocalLeftMatch,
      eventData: data,
    });
  }

  private logLocalWillLeaveMatch() {
    log.info({
      message: '[EventLogger] Local Will Leave Match',
      event: EventType.LocalWillLeaveMatch,
      eventData: {},
    });
  }

  private logLocalWillJoinMatch() {
    log.info({
      message: '[EventLogger] Local Will Join Match',
      event: EventType.LocalWillJoinMatch,
      eventData: {},
    });
  }

  private logNewMatchData(data: IEchoMatchData) {
    log.verbose({
      message: '[EventLogger] New Match Data',
      event: EventType.NewMatchData,
      eventData: data,
    });
  }

  private logLocalIsSynced(data: IEchoNewSnapshotEventData) {
    console.log(data);
    log.info({
      message: '[EventLogger] Local is Synced',
      event: EventType.LocalIsSynced,
      eventData: {
        localSessionID: data.localSnapshot?.sessionId,
        remoteSessionID: data.remoteSnapshot?.sessionId,
      },
    });
  }

  private logLocalIsUnsynced(data: IEchoNewSnapshotEventData) {
    console.log(data);
    log.info({
      message: '[EventLogger] Local is Unsynced',
      event: EventType.LocalIsUnsynced,
      eventData: {
        localSessionID: data.localSnapshot?.sessionId,
        remoteSessionID: data.remoteSnapshot?.sessionId,
      },
    });
  }

  private logNewShadowState(data: IEchoMatchData) {
    log.info({
      message: '[EventLogger] New Shadow State',
      event: EventType.NewShadowState,
      eventData: data,
    });
  }

  private logRemoteChangedTeam(data: IEchoMatchData) {
    log.info({
      message: '[EventLogger] Remote Changed Team',
      event: EventType.RemoteChangedTeam,
      eventData: data,
    });
  }
}
