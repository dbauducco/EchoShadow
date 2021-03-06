import axios, { AxiosInstance } from 'axios';
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry';
import {
  EchoSessionType,
  IEchoDataRepository,
  IEchoDataSnapshot,
  IEchoMatchPlayerData,
} from '../types';
import { log } from '../utilities/log';

// Necessary for electron
axios.defaults.adapter = require('axios/lib/adapters/http');

export default class EchoDataRepository implements IEchoDataRepository {
  private apiSessionUrl: string;

  private deviceAPI: AxiosInstance;

  constructor(private ipAddress: string, private port: string) {
    this.apiSessionUrl = `http://${this.ipAddress}:${this.port}/session`;
    this.deviceAPI = axios.create({ baseURL: this.apiSessionUrl });
  }

  /**
   * Method that returns a snapshot of the data from the Echo API. Note, if using
   * localhost an echo instance must be running on the laptop with APISettings:
   * enabled in order to get the session id of the current session.
   */
  public async getSnapshot(): Promise<IEchoDataSnapshot | undefined> {
    try {
      const echoApiResult = await this.deviceAPI.get('', {
        timeout: 3000,
      });
      const snapshotData = this.parseData(echoApiResult);
      return snapshotData;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        // Message timed out
        // log.error({
        //   networkError: 'timed out',
        //   ip: this.endpointIpAddress,
        // });
      } else if (error.code === 'ECONNREFUSED') {
        // log.error({
        //   networkError: 'refused to connect',
        //   ip: this.endpointIpAddress,
        // });
      } else {
        // log.error({
        //   description: 'Error retrieving snapshot',
        //   error: error.message ? error.message : error,
        // });
      }
      return undefined;
    }
  }

  /**
   * Method that returns a snapshot of the data from the Echo API. Note, if using
   * localhost an echo instance must be running on the laptop with APISettings:
   * enabled in order to get the session id of the current session.
   */
  public async getInstantSnapshot(): Promise<IEchoDataSnapshot | undefined> {
    try {
      const echoApiResult = await axios.get(this.apiSessionUrl);
      const snapshotData = this.parseData(echoApiResult);
      return snapshotData;
    } catch (error) {
      log.error({
        description: 'Error retrieving full snapshot',
        error: error.message ? error.message : error,
      });
      return undefined;
    }
  }

  /**
   * Method that returns a snapshot of the data from the Echo API in the raw format. Note, if using
   * localhost an echo instance must be running on the laptop with APISettings:
   * enabled in order to get the session id of the current session.
   */
  public async getInstantRawSnapshot(): Promise<any | undefined> {
    try {
      const echoApiResult = await axios.get(this.apiSessionUrl);
      return echoApiResult.data;
    } catch (error) {
      log.error({
        description: 'Error retrieving full snapshot',
        error: error.message ? error.message : error,
      });
      return undefined;
    }
  }

  /** Helper method to control retries on main snapshot */
  public enableRetries() {
    this.deviceAPI = axios.create({ baseURL: this.apiSessionUrl });
    axiosRetry(this.deviceAPI, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      shouldResetTimeout: true,
      retryCondition: e => {
        return isNetworkOrIdempotentRequestError(e);
      },
    });
  }

  public disableRetries() {
    this.deviceAPI = axios.create({ baseURL: this.apiSessionUrl });
  }

  private parseData(echoApiResult: any) {
    const snapshotData: IEchoDataSnapshot = {
      sessionId: echoApiResult.data.sessionid,
      sessionType: this.sessionTypeByName(echoApiResult.data.match_type),
      client: {
        name: echoApiResult.data.client_name,
        position: echoApiResult.data.player.vr_position,
        forward: echoApiResult.data.player.vr_forward,
        left: echoApiResult.data.player.vr_left,
        up: echoApiResult.data.player.vr_up,
      },
      blueTeamMembers: this.mapPlayerData(echoApiResult.data.teams[0].players),
      orangeTeamMembers: this.mapPlayerData(
        echoApiResult.data.teams[1].players
      ),
      spectatorMembers: this.mapPlayerData(echoApiResult.data.teams[2].players),
      inMatch: false, // Overriden in next line
    };
    // Actually set in match:
    snapshotData.inMatch = this.isInMatch(snapshotData.sessionType);
    return snapshotData;
  }

  /**
   * Helper method to get the index of a player by name. The index should match the
   * key to spectate them.
   */
  private getPlayerIndex(echoApiResult: any, playerName?: string): number {
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

  /**
   * Helper method to check if the snapshot is from a match
   */
  private isInMatch(sessionType: EchoSessionType) {
    return (
      sessionType === EchoSessionType.Arena_Match ||
      sessionType === EchoSessionType.Private_Arena_Match
    );
  }

  /**
   * Helper method to get names for a team
   */
  private mapPlayerData(listOfPlayers: any): IEchoMatchPlayerData[] {
    if (!listOfPlayers) {
      return [];
    }

    return listOfPlayers.map((player: { name: string; head: any }) => {
      return {
        name: player.name,
        position: player.head.position,
        left: player.head.left,
        up: player.head.up,
        forward: player.head.forward,
      };
    });
  }
}
