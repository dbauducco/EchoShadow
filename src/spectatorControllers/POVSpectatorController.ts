import EchoVRClient from '../clients/EchoVRClient';
import { IEchoMatchData, IEchoSpectatorController } from '../types';
import { log } from '../utilities';
import { MatchCameraAnalyzer } from '../utilities/MatchCameraAnalyzer';

export default class POVSpectatorController
  implements IEchoSpectatorController {
  cameraAnalyzer = new MatchCameraAnalyzer();
  call_count = 0;

  constructor(private echoVrClient: EchoVRClient, private target?: string) {}

  async getDefault(matchData: IEchoMatchData) {
    const remote_index = this.getPlayerIndex(matchData);
    if (remote_index != -1) {
      this.echoVrClient.requestPOV(remote_index);
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
}
