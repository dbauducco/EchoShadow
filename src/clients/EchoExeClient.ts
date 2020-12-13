// typescript is stupid sometimes so we are just going to "require" instead of "import" this to avoid compiling errors
const taskkill = require('taskkill');

import { exec as execNative } from 'child_process';
import { promisify } from 'util';
const exec = promisify(execNative);

import { log } from '../utilities/log';

export default class EchoExeClient {
  private SPECTATOR_FLAG = ' --spectatorstream';
  private LOBBY_FLAG = ' --lobbyid ';

  constructor(private echoPath: string) {
    // We don't need to do anything here. echoPath variable
    // is automatically created
  }

  /**
   * Method to open EchoVR.exe with spectator stream automatically set. Using
   * the lobby id parameter allows the game to automatically join a specific
   * match.
   * @param sessionID (Optional) The sessionID to which join. If not defined,
   * the game will open to a random public match.
   */
  open = async (sessionID?: string) => {
    try {
      const openCommand = this.buildCommand(sessionID);
      const execResult = await exec(openCommand);
      return execResult;
    } catch (error) {
      log.error({
        message: 'error opening exe',
        error: error.message || error,
      });
    }
  };

  /**
   * A helper method to build a string command with which to join a session, in
   * the format of: '"{path}" --spectatorStream --lobbyId {lobbyId}'
   * @param sessionID (Optional) The sessionId (lobbyId) to which add. If not
   * defined, no lobbyId flag gets added to the end of the command string.
   */
  private buildCommand = (sessionID?: string) => {
    const openCommandWithSpecatator = `"${this.echoPath}"${this.SPECTATOR_FLAG}`; // Add ---spectatorstream to the end
    if (sessionID) {
      const openCommandWithSpectatorAndLobby = `${openCommandWithSpecatator}${this.LOBBY_FLAG}${sessionID}`; // If we have lobby, add --lobbyid {lobbyId}
      return openCommandWithSpectatorAndLobby;
    }
    return openCommandWithSpecatator;
  };

  /**
   * Method to close EchoVR.exe
   * Warning: Will close any and all intances of EchoVR running on the computer, not
   * only the instance that we opened.
   */
  close = async (process?: any) => {
    // If a pid is defined, we will only kill that specific process.
    const killId = process ? process.pid : 'echovr.exe';
    try {
      // {tree:true} will also kill any process started by the EchoVR process. Known
      // as tree killing.
      await taskkill(killId, { tree: true });
    } catch (error) {
      const errorDescription =
        'Error: Instance of EchoVR was not running when close was called.';
      log.error({
        description: errorDescription,
        error: error.message ? error.message : error,
      });
    }
  };
}
