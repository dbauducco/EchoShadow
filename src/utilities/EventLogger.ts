import {
  IEchoMatchChangedEventData,
  IEchoSnapshotChangedEventData,
} from '../types';
import { EventType } from '../types/EventType';
import { log } from '../utilities';
import Events from './Events';

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
    Events.on(
      EventType.LocalSnapshotChanged,
      this.logLocalSnapshotChanged.bind(this)
    );
    Events.on(
      EventType.RemoteSnapshotChanged,
      this.logRemoteSnapshotChanged.bind(this)
    );
  }

  private logRemoteJoinedMatch(data: IEchoMatchChangedEventData) {
    log.info({
      event: EventType.RemoteJoinedMatch,
      eventData: data,
    });
  }

  private logRemoteLeftMatch(data: IEchoMatchChangedEventData) {
    log.info({
      event: EventType.RemoteLeftMatch,
      eventData: data,
    });
  }

  private logLocalJoinedMatch(data: IEchoMatchChangedEventData) {
    log.info({
      event: EventType.LocalJoinedMatch,
      eventData: data,
    });
  }

  private logLocalLeftMatch(data: IEchoMatchChangedEventData) {
    log.info({
      event: EventType.LocalLeftMatch,
      eventData: data,
    });
  }

  private logLocalWillLeaveMatch(data: IEchoMatchChangedEventData) {
    log.info({
      event: EventType.LocalWillLeaveMatch,
      eventData: data,
    });
  }

  private logLocalWillJoinMatch(data: IEchoMatchChangedEventData) {
    log.info({
      event: EventType.LocalWillJoinMatch,
      eventData: data,
    });
  }

  private logLocalSnapshotChanged(data: IEchoSnapshotChangedEventData) {
    log.info({
      event: EventType.LocalSnapshotChanged,
      eventData: data,
    });
  }

  private logRemoteSnapshotChanged(data: IEchoSnapshotChangedEventData) {
    log.info({
      event: EventType.RemoteSnapshotChanged,
      eventData: data,
    });
  }
}
