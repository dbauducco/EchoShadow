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
      message: 'EventLogger.logNewSnapshotData',
      event: EventType.NewSnapshotData,
      eventData: data,
    });
  }

  private logRemoteJoinedMatch(data: IEchoNewSnapshotEventData) {
    log.info({
      message: 'EventLogger.logRemoteJoinedMatch',
      event: EventType.RemoteJoinedMatch,
      eventData: data,
    });
  }

  private logRemoteLeftMatch(data: IEchoNewSnapshotEventData) {
    log.info({
      message: 'EventLogger.logRemoteLeftMatch',
      event: EventType.RemoteLeftMatch,
      eventData: data,
    });
  }

  private logLocalJoinedMatch(data: IEchoNewSnapshotEventData) {
    log.info({
      message: 'EventLogger.logLocalJoinedMatch',
      event: EventType.LocalJoinedMatch,
      eventData: data,
    });
  }

  private logLocalLeftMatch(data: IEchoNewSnapshotEventData) {
    log.info({
      message: 'EventLogger.logLocalLeftMatch',
      event: EventType.LocalLeftMatch,
      eventData: data,
    });
  }

  private logLocalWillLeaveMatch() {
    log.info({
      message: 'EventLogger.logLocalWillLeaveMatch',
      event: EventType.LocalWillLeaveMatch,
      eventData: {},
    });
  }

  private logLocalWillJoinMatch() {
    log.info({
      message: 'EventLogger.logLocalWillJoinMatch',
      event: EventType.LocalWillJoinMatch,
      eventData: {},
    });
  }

  private logNewMatchData(data: IEchoMatchData) {
    log.verbose({
      message: 'EventLogger.logNewMatchData',
      event: EventType.NewMatchData,
      eventData: data,
    });
  }

  private logLocalIsSynced(data: IEchoMatchData) {
    log.info({
      message: 'EventLogger.logLocalIsSynced',
      event: EventType.LocalIsSynced,
      eventData: data,
    });
  }

  private logLocalIsUnsynced(data: IEchoMatchData) {
    log.info({
      message: 'EventLogger.logLocalIsUnsynced',
      event: EventType.LocalIsUnsynced,
      eventData: data,
    });
  }

  private logNewShadowState(data: IEchoMatchData) {
    log.info({
      message: 'EventLogger.logNewShadowState',
      event: EventType.NewShadowState,
      eventData: data,
    });
  }

  private logRemoteChangedTeam(data: IEchoMatchData) {
    log.info({
      message: 'EventLogger.logRemoteChangedTeam',
      event: EventType.RemoteChangedTeam,
      eventData: data,
    });
  }
}
