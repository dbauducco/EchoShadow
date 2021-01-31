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
      event: EventType.NewSnapshotData,
      eventData: data,
    });
  }

  private logRemoteJoinedMatch(data: IEchoNewSnapshotEventData) {
    log.info({
      event: EventType.RemoteJoinedMatch,
      eventData: data,
    });
  }

  private logRemoteLeftMatch(data: IEchoNewSnapshotEventData) {
    log.info({
      event: EventType.RemoteLeftMatch,
      eventData: data,
    });
  }

  private logLocalJoinedMatch(data: IEchoNewSnapshotEventData) {
    log.info({
      event: EventType.LocalJoinedMatch,
      eventData: data,
    });
  }

  private logLocalLeftMatch(data: IEchoNewSnapshotEventData) {
    log.info({
      event: EventType.LocalLeftMatch,
      eventData: data,
    });
  }

  private logLocalWillLeaveMatch() {
    log.info({
      event: EventType.LocalWillLeaveMatch,
      eventData: {},
    });
  }

  private logLocalWillJoinMatch() {
    log.info({
      event: EventType.LocalWillJoinMatch,
      eventData: {},
    });
  }

  private logNewMatchData(data: IEchoMatchData) {
    log.verbose({
      event: EventType.NewMatchData,
      eventData: data,
    });
  }

  private logLocalIsSynced(data: IEchoMatchData) {
    log.info({
      event: EventType.LocalIsSynced,
      eventData: data,
    });
  }

  private logLocalIsUnsynced(data: IEchoMatchData) {
    log.info({
      event: EventType.LocalIsUnsynced,
      eventData: data,
    });
  }

  private logNewShadowState(data: IEchoMatchData) {
    log.info({
      event: EventType.NewShadowState,
      eventData: data,
    });
  }

  private logRemoteChangedTeam(data: IEchoMatchData) {
    log.info({
      event: EventType.RemoteChangedTeam,
      eventData: data,
    });
  }
}
