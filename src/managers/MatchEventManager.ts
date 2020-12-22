import {
  EchoSessionType,
  IEchoDataRepository,
  IEchoDataSnapshot,
  IEchoNewSnapshotEventData,
  IEchoSnapshotOverviewsEventData,
} from '../types';
import Events from '../utilities/Events';
import { IEchoMatchData, EventType } from '../types';
import { isRetryableError } from 'axios-retry';

export default class ShadowEventManager {
  // Storing the current match state
  currentMatchData: IEchoMatchData | undefined;

  constructor(private localDataRepository: IEchoDataRepository) {
    // Our current match is undefined

    Events.on(EventType.NewSnapshotData, this.newSnapshotData.bind(this));
  }

  private newSnapshotData(data: IEchoNewSnapshotEventData) {
    // Check if remote joined new match
    if (
      !this.currentMatchData &&
      data.remoteSnapshot &&
      data.remoteSnapshot.inMatch
    ) {
      this.currentMatchData = {
        sessionID: data.remoteSnapshot.sessionId,
        sessionType: EchoSessionType.Arena_Match,
        isLocalInMatch: false,
        isRemoteInMatch: false,
        remoteName: '',
        localName: '',
      };
    }

    // If the current match data is still undefined, then we
    // don't need any more checks
    if (!this.currentMatchData) {
      return;
    }

    // Update status of remote and local being in match
    const newRemoteStatus = this.checkInMatch(
      data.remoteSnapshot,
      this.currentMatchData.remoteName,
      data.localSnapshot
    );
    const newLocalStatus = this.checkInMatch(
      data.localSnapshot,
      this.currentMatchData.localName,
      data.remoteSnapshot
    );

    // Detect a change in remote status
    if (this.currentMatchData.isRemoteInMatch != newRemoteStatus) {
      this.currentMatchData.isRemoteInMatch = newRemoteStatus;

      if (newRemoteStatus) {
        // Remote joined the match
        this.currentMatchData.remoteName = data.remoteSnapshot!.clientName;
        Events.emit(EventType.RemoteJoinedMatch, this.currentMatchData);
      } else {
        // Remote left the match
        Events.emit(EventType.RemoteLeftMatch, this.currentMatchData);
      }
    }

    // Detect a change in local status
    if (this.currentMatchData.isLocalInMatch != newLocalStatus) {
      this.currentMatchData.isLocalInMatch = newLocalStatus;

      if (newLocalStatus) {
        // Local joined the match
        this.currentMatchData.localName = data.localSnapshot!.clientName;
        Events.emit(EventType.LocalJoinedMatch, this.currentMatchData);
        this.pingLocal();
      } else {
        // Local left the match
        Events.emit(EventType.LocalLeftMatch, this.currentMatchData);
      }
    }

    // Check if both remote and local are no longer in the match
    if (
      !this.currentMatchData.isRemoteInMatch &&
      !this.currentMatchData.isLocalInMatch
    ) {
      // Reset the current match data
      this.currentMatchData = undefined;
    }

    Events.emit(EventType.NewMatchData, this.currentMatchData);
  }

  private async pingLocal() {
    const data = await this.localDataRepository.getFullSnapshot();

    if (this.currentMatchData?.isLocalInMatch)
      setTimeout(this.pingLocal.bind(this), 0.1 * 1000);
  }

  private checkInMatch(
    sourceData: IEchoDataSnapshot | undefined,
    sourceName: string,
    alternateData: IEchoDataSnapshot | undefined
  ) {
    // Our source has data, we can easily check if they are in the match or not
    if (sourceData) {
      return sourceData.sessionId == this.currentMatchData!.sessionID;
    }

    // ---------------------
    // Our source didn't return data, let's try to use the alternate data's
    // listing of players to see if it is still in our match
    // ---------------------
    if (!alternateData) {
      // We don't have alternate data, so we can't check, ooof.
      // Let's just say that they aren't in the match
      return false;
    }

    // Let's check if they player is in one of the teams
    return (
      alternateData.blueTeamMembers.indexOf(sourceName) > -1 ||
      alternateData.orangeTeamMembers.indexOf(sourceName) > -1 ||
      alternateData.spectatorMembers.indexOf(sourceName) > -1
    );
  }
}
