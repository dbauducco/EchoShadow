import * as os from 'os';
import * as fse from 'fs-extra';
import * as path from 'path';
import { EventType, IConfigInfo, ShadowStateType } from '../types';
import {
  getProcessId,
  log,
  exec,
  killProcess,
  spawn,
  Events,
} from '../utilities';
import { EchoVRClientSpectatorHelper } from './helpers/EchoVRClient.Spectator.Helper';

export default class EchoVRClient {
  private SPECTATOR_FLAG = '--spectatorstream';

  private LOBBY_FLAG = '--lobbyid';

  private HEADLESS_FLAG = '--headless';

  private spectatorHelper: EchoVRClientSpectatorHelper;

  constructor(private config: IConfigInfo) {
    this.verifyPath();
    this.enableEchoVRAPI();
    this.spectatorHelper = new EchoVRClientSpectatorHelper(
      config.spectatorOptions.keyboardAggressiveness
    );
  }

  /**
   * Method to open EchoVR.exe with spectator stream automatically set. Using
   * the lobby id parameter allows the game to automatically join a specific
   * match.
   * @param sessionID (Optional) The sessionID to which join. If not defined,
   * the game will open to a random public match.
   */
  open = (sessionID?: string, headless?: boolean) => {
    try {
      // Setting up params
      const params: string[] = [this.SPECTATOR_FLAG];
      if (sessionID) {
        params.push(this.LOBBY_FLAG);
        params.push(sessionID);
      }
      if (headless) {
        params.push(this.HEADLESS_FLAG);
      }

      // Spawning the process
      // const spawnOptions = { detached: true };
      // return spawn(this.echoPath, params, spawnOptions);
      return exec(`"${this.config.echoPath}" ${params.join(' ')}`);
    } catch (error) {
      log.error({
        message: 'error opening exe',
        error: error.message || error,
      });
      throw error;
    }
  };

  /**
   * A helper method to build a string command with which to join a session, in
   * the format of: '"{path}" --spectatorStream --lobbyId {lobbyId}'
   * @param sessionID (Optional) The sessionId (lobbyId) to which add. If not
   * defined, no lobbyId flag gets added to the end of the command string.
   */
  private buildCommand = (sessionID?: string, headless?: boolean) => {
    const openCommandWithSpecatator = `"${this.config.echoPath}"${this.SPECTATOR_FLAG}`; // Add ---spectatorstream to the end
    if (sessionID) {
      const openCommandWithSpectatorAndLobby = `${openCommandWithSpecatator}${this.LOBBY_FLAG}${sessionID}`; // If we have lobby, add --lobbyid {lobbyId}
      return openCommandWithSpectatorAndLobby;
    }
    if (headless) {
      const openCommandWithSpectatorAndHeadless = `${openCommandWithSpecatator}${this.HEADLESS_FLAG}`;
      return openCommandWithSpectatorAndHeadless;
    }
    return openCommandWithSpecatator;
  };

  /**
   * Method to close EchoVR.exe
   * Warning: Will close any and all intances of EchoVR running on the computer, not
   * only the instance that we opened.
   */
  close = async (processId?: string | number) => {
    try {
      await killProcess(processId, true);
    } catch (error) {
      log.error({
        message: 'error while closing echo',
        error: error.message ? error.message : error,
      });
    }
  };

  /**
   * Method to get the PID of the current instance of EchoVR.exe
   */
  findPID = async () => {
    try {
      const echoPid = await getProcessId('echovr.exe');
      return echoPid;
    } catch (error) {
      log.error({
        message: 'error while finding echo process id',
        error: error.message || error,
      });
      throw error;
    }
  };

  /** Helper method that verifies the EchoVR exe path provided */
  verifyPath = async () => {
    if (!this.config.echoPath) {
      // Dirty fix to wait for the event listeners to register first
      setTimeout(() => {
        Events.emit(
          EventType.NewShadowState,
          ShadowStateType.EchoIsNotInstalled
        );
      }, 1000);
      return;
    }

    try {
      const newProcess = spawn(
        this.config.echoPath,
        [this.HEADLESS_FLAG, this.SPECTATOR_FLAG],
        {}
      );

      // Error event means the game was unable to launch. The path is most likelu not correct.
      newProcess.on('error', async () => {
        Events.emit(EventType.NewShadowState, ShadowStateType.InvalidEchoPath);
      });

      // We are gonna kill the process now
      newProcess.kill();
    } catch (error) {
      log.error({ message: 'error verifying path', error });
    }
  };

  /** * Helper methods to automatically turn on the EnableAPI flag in the EchoAPI */
  enableEchoVRAPI = async () => {
    // Read the file
    const configData = await this.readConfigFile();
    if (!configData.game.EnableAPIAccess) {
      configData.game.EnableAPIAccess = true;
      this.writeConfigFile(configData);
    }
  };

  readConfigFile = async () => {
    // Create the path
    const configPath = path.join(
      os.homedir(),
      'AppData/Local/rad/loneecho/settings_mp_v2.json'
    );
    // Try to read the file
    try {
      const fileBuffer = fse.readFileSync(configPath);
      if (!fileBuffer) {
        // File doesn't exist, we need to create it
        return await this.createAndReadConfigFile();
      }
      return JSON.parse(fileBuffer.toString());
    } catch (error) {
      if (error.code === 'ENOENT') {
        return this.createAndReadConfigFile();
      }
      log.error({
        message: 'Failed to read EchoVR config.',
        error: error.message,
      });
      return undefined;
    }
  };

  createAndReadConfigFile = () =>
    new Promise(res => {
      // Create the path
      const configPath = path.join(
        os.homedir(),
        'AppData/Local/rad/loneecho/settings_mp_v2.json'
      );
      // File doesn't exist. We need to temporarily start EchoVR for it to auto-create this file.
      const echoProcess = this.open(undefined, true);
      setTimeout(() => {
        try {
          this.close();
          const newFileBuffer = fse.readFileSync(configPath);
          if (!newFileBuffer) {
            log.error({
              message: 'Failed to read EchoVR config after creating it.',
            });
            res(undefined);
          }
          res(JSON.parse(newFileBuffer.toString()));
        } catch (error) {
          log.error({
            message: 'Failed to read EchoVR config after creating it.',
            error: error.message,
          });
          res(undefined);
        }
      }, 2000);
    });

  writeConfigFile = async (data: any) => {
    // Create the path
    const configPath = path.join(
      os.homedir(),
      'AppData/Local/rad/loneecho/settings_mp_v2.json'
    );
    // Write the file
    await fse.outputFile(configPath, JSON.stringify(data, null, 4));
  };

  public requestFollowByIndex(playerIndex: number) {
    return this.spectatorHelper.requestFollowByIndex(playerIndex);
  }

  public requestFollow() {
    return this.spectatorHelper.requestFollow();
  }

  public requestPOV() {
    return this.spectatorHelper.requestPOV();
  }

  public requestCameraByIndex(cameraIndex: number) {
    return this.spectatorHelper.requestCameraByIndex(cameraIndex);
  }

  public requestSideline() {
    return this.spectatorHelper.requestSideline();
  }

  public requestUIToggle() {
    return this.spectatorHelper.requestUIToggle();
  }

  public listenOrange() {
    return this.spectatorHelper.listenOrange();
  }

  public listenBlue() {
    return this.spectatorHelper.listenBlue();
  }

  public muteAll() {
    return this.spectatorHelper.muteAll();
  }

  public showScoreBoard(secondsToShow: number) {
    return this.spectatorHelper.showScoreBoard(secondsToShow);
  }
}
