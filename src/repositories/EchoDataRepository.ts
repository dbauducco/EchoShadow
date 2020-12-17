import axios from 'axios';
import {
  EchoSessionType,
  IEchoDataRepository,
  IEchoDataSnapshot,
} from '../types';
import { log } from '../utilities/log';

// Necessary for electron
axios.defaults.adapter = require('axios/lib/adapters/http');

export default class EchoDataRepository implements IEchoDataRepository {
  private apiSessionUrl: string;

  private DEFAULT_PORT = '6721';

  constructor(public endpointIpAddress: string) {
    this.apiSessionUrl = `http://${this.endpointIpAddress}:${this.DEFAULT_PORT}/session`;
  }

  /**
   * Method that returns a snapshot of the data from the Echo API. Note, if using
   * localhost an echo instance must be running on the laptop with APISettings:
   * enabled in order to get the session id of the current session.
   */
  public async getSnapshot(): Promise<IEchoDataSnapshot | undefined> {
    try {
      const echoApiResult = await axios.get(this.apiSessionUrl, {
        timeout: 200,
      });
      const snapshotData = {
        sessionId: echoApiResult.data.sessionid,
        sessionType: this.sessionTypeByName(echoApiResult.data.match_type),
        clientName: echoApiResult.data.client_name,
        clientIndexId: this.getIndexOfPlayer(echoApiResult),
      };
      return snapshotData;
    } catch (error) {
      // Messaged timed out
      if (error.code == 'ECONNABORTED') {
        // Message timed out
      } else {
        log.error({
          description: 'Error retrieving snapshot',
          error: error.message ? error.message : error,
        });
      }
      return undefined;
    }
  }

  /**
   * Method that returns a snapshot of the data from the Echo API. Note, if using
   * localhost an echo instance must be running on the laptop with APISettings:
   * enabled in order to get the session id of the current session.
   */
  public async getFullSnapshot(): Promise<any | undefined> {
    try {
      const echoApiResult = await axios.get(this.apiSessionUrl);
      return echoApiResult;
    } catch (error) {
      log.error({
        description: 'Error retrieving full snapshot',
        error: error.message ? error.message : error,
      });
      return undefined;
    }
  }

  /**
   * Helper method to get the index of a player by name. The index should match the
   * key to spectate them.
   */
  private getIndexOfPlayer(echoApiResult: any, playerName?: string): number {
    // Store the player name we are searching for
    const playerToSearchFor = playerName || echoApiResult.client_name;

    // Check the orange team first
    const orangeTeamPlayers = echoApiResult.data.teams[1].players;
    if (orangeTeamPlayers !== undefined) {
      const orangeTeamNames = orangeTeamPlayers.map(
        (p: { name: any; playerid: any }) => {
          return p.name;
        }
      );
      const orangeTeamIndex = orangeTeamNames.indexOf(playerToSearchFor) + 1;
      if (orangeTeamIndex !== 0) {
        return orangeTeamIndex;
      }
    }

    // Check the blue team
    const blueTeamPlayers = echoApiResult.data.teams[0].players;
    if (blueTeamPlayers !== undefined) {
      const blueTeamNames = blueTeamPlayers.map(
        (p: { name: any; playerid: any }) => {
          return p.name;
        }
      );
      const blueTeamIndex = blueTeamNames.indexOf(playerToSearchFor) + 6;
      if (blueTeamIndex !== 5) {
        return blueTeamIndex;
      }
    }

    // Player was not found on either team. Either not in the match or a spectator?
    return -1;
  }

  /**
   * Converts a string into an EchoSessionType
   * @param name The string from the api data
   */
  private sessionTypeByName(name: string): EchoSessionType {
    if (name === 'Echo_Arena') {
      return EchoSessionType.Arena_Match;
    }
    if (name === 'Echo_Arena_Private') {
      return EchoSessionType.Private_Arena_Match;
    }
    if (name === 'Social_2.0') {
      return EchoSessionType.Lobby;
    }
    return EchoSessionType.Unknown;
  }
}
