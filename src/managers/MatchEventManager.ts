import { TouchBarScrubber } from 'electron';
import {
  EchoSessionType,
  IEchoDataRepository,
  IEchoDataSnapshot,
  IEchoNewSnapshotEventData,
  IEchoMatchData,
  EventType,
} from '../types';
import Events from '../utilities/Events';

export default class MatchEventManager {
  // Storing the current match state
  currentMatchData: IEchoMatchData | undefined;

  constructor(private localDataRepository: IEchoDataRepository) {
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
        discPosition: [0, 0, 0],
        remote: {
          inMatch: false,
          index: -1,
          name: '',
          team: '',
        },
        local: {
          inMatch: false,
          team: '',
          name: '',
          position: [0, 0, 0],
          up: [0, 0, 0],
          forward: [0, 0, 0],
          left: [0, 0, 0],
        },
        game: { disc: [0, 0, 0], bluePlayers: [], orangePlayers: [] },
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
      this.currentMatchData.remote.name,
      data.localSnapshot
    );
    const newLocalStatus = this.checkInMatch(
      data.localSnapshot,
      this.currentMatchData.local.name,
      data.remoteSnapshot
    );

    // Detect a change in remote status
    if (this.currentMatchData.remote.inMatch !== newRemoteStatus) {
      this.currentMatchData.remote.inMatch = newRemoteStatus;

      if (newRemoteStatus) {
        // Remote joined the match
        this.currentMatchData.remote.name =
          data.remoteSnapshot!.client.name || '';

        // Emitting the event
        Events.emit(EventType.RemoteJoinedMatch, this.currentMatchData);
      } else {
        // Remote left the match
        Events.emit(EventType.RemoteLeftMatch, this.currentMatchData);
      }
    }

    // Detect a change in local status
    if (this.currentMatchData.local.inMatch !== newLocalStatus) {
      this.currentMatchData.local.inMatch = newLocalStatus;

      if (newLocalStatus) {
        // Local joined the match
        this.currentMatchData.local.name =
          data.localSnapshot?.client.name || '';
        // Finding remote player's game index
        const playerTeamData = this.findPlayerData(
          data.localSnapshot!,
          this.currentMatchData.remote.name
        );
        this.currentMatchData.remote.team = playerTeamData[0];
        this.currentMatchData.remote.index = playerTeamData[1];
        Events.emit(EventType.LocalJoinedMatch, this.currentMatchData);
        this.pingLocal();
      } else {
        // Local left the match
        Events.emit(EventType.LocalLeftMatch, this.currentMatchData);
      }
    }

    // Check if both remote and local are no longer in the match
    if (
      !this.currentMatchData.remote.inMatch &&
      !this.currentMatchData.local.inMatch
    ) {
      // Reset the current match data
      this.currentMatchData = undefined;
    }

    Events.emit(EventType.NewMatchData, this.currentMatchData);
  }

  private async pingLocal() {
    // Get new data
    const data = await this.localDataRepository.getSnapshot();

    // Update player team and index
    const playerTeamData = this.findPlayerData(
      data!,
      this.currentMatchData!.remote.name
    );
    this.currentMatchData!.remote.team = playerTeamData[0];
    this.currentMatchData!.remote.index = playerTeamData[1];
    // Update local position
    this.currentMatchData!.local.position = data!.client.position;
    this.currentMatchData!.local.forward = data!.client.forward;
    this.currentMatchData!.local.up = data!.client.up;
    this.currentMatchData!.local.left = data!.client.left;
    // Update player postions
    this.currentMatchData!.game.bluePlayers = data!.blueTeamMembers;
    this.currentMatchData!.game.orangePlayers = data!.orangeTeamMembers;

    // Emit the match data
    Events.emit(EventType.NewMatchData, this.currentMatchData);

    // Loop the function
    if (this.currentMatchData?.local.inMatch)
      setTimeout(this.pingLocal.bind(this), 0.1 * 1000);
  }

  // **** HELPER METHODS **** //
  private checkInMatch(
    sourceData: IEchoDataSnapshot | undefined,
    sourceName: string,
    alternateData: IEchoDataSnapshot | undefined
  ) {
    // Our source has data, we can easily check if they are in the match or not
    if (sourceData) {
      return sourceData.sessionId === this.currentMatchData?.sessionID;
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
    return this.findPlayerData(alternateData, sourceName)[1] != -1;
  }

  private findPlayerData(
    snapshot: IEchoDataSnapshot,
    name: string
  ): [string, number, number[]] {
    const blueIndex = snapshot.blueTeamMembers.findIndex(playerData => {
      return playerData.name == name;
    });
    const orangeIndex = snapshot.orangeTeamMembers.findIndex(playerData => {
      return playerData.name == name;
    });
    const spectatorIndex = snapshot.spectatorMembers.findIndex(playerData => {
      return playerData.name == name;
    });

    if (blueIndex != -1) {
      return ['blue', blueIndex, snapshot.blueTeamMembers[blueIndex].position];
    } else if (orangeIndex != -1) {
      return [
        'orange',
        orangeIndex,
        snapshot.orangeTeamMembers[orangeIndex].position,
      ];
    } else if (spectatorIndex != -1) {
      return ['spectator', 11, [0, 0, 0]];
    } else {
      return ['other', -1, [0, 0, 0]];
    }
  }
}
