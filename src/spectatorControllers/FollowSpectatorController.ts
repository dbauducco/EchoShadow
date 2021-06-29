import { IEchoMatchData, IEchoSpectatorController } from '../types';
import { log } from '../utilities';
import { MatchCameraAnalyzer } from '../utilities/MatchCameraAnalyzer';
import EchoVRClient from '../clients/EchoVRClient';
import { remote } from 'electron';

export default class FollowSpectatorController
  implements IEchoSpectatorController {
  cameraAnalyzer = new MatchCameraAnalyzer();
  call_count = 0;

  constructor(private echoVrClient: EchoVRClient, private target?: string) {}

  async getDefault(matchData: IEchoMatchData) {
    const remote_index = this.getPlayerIndex(matchData);
    console.log(matchData.game.bluePlayers.length);
    if (remote_index != -1) {
      this.echoVrClient.requestFollowByIndex(remote_index);
    }
  }

  async update(matchData: IEchoMatchData) {
    if (this.call_count < 20) {
      this.call_count++;
      return;
    }

    this.call_count = 0;
    this.getDefault(matchData);
  }
  /**
   * Helper method to get the index of a player by name. The index should match the
   * key to spectate them.
   */
  private getPlayerIndex(
    matchData: IEchoMatchData,
    playerName?: string
  ): number {
    // Store the player name we are searching for
    const playerToSearchFor = playerName || matchData.remote.name;

    // Check the orange team first
    const orangeTeamPlayers = matchData.game.orangePlayers;
    if (orangeTeamPlayers !== undefined) {
      const orangeTeamNames = orangeTeamPlayers.map((p: { name: any }) => {
        return p.name;
      });
      const orangeTeamIndex = orangeTeamNames.indexOf(playerToSearchFor) + 1;
      if (orangeTeamIndex !== 0) {
        return orangeTeamIndex;
      }
    }

    // Check the blue team
    const blueTeamPlayers = matchData.game.bluePlayers;
    if (blueTeamPlayers !== undefined) {
      const blueTeamNames = blueTeamPlayers.map((p: { name: any }) => {
        return p.name;
      });
      const blueTeamIndex = blueTeamNames.indexOf(playerToSearchFor) + 6;
      if (blueTeamIndex !== 5) {
        return blueTeamIndex;
      }
    }

    // Player was not found on either team. Either not in the match or a spectator?
    return -1;
  }

  /*********************************************************************/
  /*********************** OLD CODE WITH COMPLEX SWITCHING *************/
  /*********************************************************************/
  /*
    Due to patch to the Spectator Player Indexes, this complex camera
    switching shouldn't be necessary.
 */
  /*
  // Default
  async getDefault(matchData: IEchoMatchData) {
    // Provide default target name to be on remote
    if (typeof this.target === 'undefined') {
      this.target = matchData.remote.name;
    }
    // Go to the first person
    this.setPossibleKeys(matchData);
    await this.echoVrClient.requestFollowByIndex(
      this.possibleKeys[this.currentKeyIndex]
    );
  }

  // Updating
  async update(matchData: IEchoMatchData) {
    // Provide default target name to be on remote
    if (typeof this.target === 'undefined') {
      this.target = matchData.remote.name;
    }
    // Get the current camera
    const predictedCamera = this.cameraAnalyzer.getCamera(matchData);
    if (!predictedCamera) {
      return;
    }

    log.info(`Camera is currently on: ${predictedCamera}`);
    // We need to go to the next camera
    if (predictedCamera === `${this.target!}#FOLLOW`) {
      log.info('We found the person!!');
      this.cameraAnalyzer.useHighCondifenceMode();
    } else {
      // Set the possible keys
      this.setPossibleKeys(matchData);
      // Change the camera analyzer mode
      this.cameraAnalyzer.useLowConfidenceMode();
      // Increase the current key
      this.currentKeyIndex++;
      if (this.currentKeyIndex >= this.possibleKeys.length) {
        // Loop the current key around to the start
        this.currentKeyIndex = 0;
      }
      // Keytap the new play key
      await this.echoVrClient.requestFollowByIndex(
        this.possibleKeys[this.currentKeyIndex]
      );
    }
  }

  setPossibleKeys(matchData: IEchoMatchData) {
    const team = this.teamForPlayer(this.target!, matchData);
    if (team === 'blue') {
      // The possible keys are the default blue keys, and only the
      // keys depending on how many players there are
      this.possibleKeys = [6, 7, 8, 9, 0].slice(
        0,
        matchData.game.bluePlayers.length
      );
    } else if (team === 'orange') {
      // The possible keys are the default orange keys, and only the
      // keys depending on how many players there are
      this.possibleKeys = [1, 2, 3, 4, 5].slice(
        0,
        matchData.game.orangePlayers.length
      );
    }
    log.info(`Set possible keys to: ${this.possibleKeys}`);
  }

  private teamForPlayer(playerName: string, matchData: IEchoMatchData) {
    const blueIndex = matchData.game.bluePlayers.findIndex(playerData => {
      return playerData.name === this.target!;
    });
    const orangeIndex = matchData.game.orangePlayers.findIndex(playerData => {
      return playerData.name === this.target!;
    });
    if (blueIndex !== -1) {
      return 'blue';
    }
    if (orangeIndex !== -1) {
      return 'orange';
    }
    return 'unknown';
  }

  */
}
