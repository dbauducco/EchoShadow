import { getProcessId, log } from '../utilities';
import {
  EchoSessionType,
  IEchoDataSnapshot,
  IEchoMatchData,
  IEchoNewSnapshotEventData,
} from '../types';
import EchoVRClient from '../clients/EchoVRClient';
import Events from '../utilities/Events';
import { EventType } from '../types/EventType';
import { ShadowStateType } from '../types/ShadowStateType';

export default class EchoVRManager {
  private echoVRClient: EchoVRClient;
  private currentInstanceProcessId: string | undefined;
  private isLoadingIntoMatch = false;

  // Used for checking if the game is stuck
  private undefinedAPICounter = 0;

  constructor(echoPath: string) {
    this.echoVRClient = new EchoVRClient(echoPath);
    Events.on(EventType.RemoteJoinedMatch, this.remoteJoinedMatch.bind(this));
    Events.on(EventType.RemoteLeftMatch, this.remoteLeftMatch.bind(this));
    Events.on(
      EventType.LocalIsUnsynced,
      this.localIsUnsyncedWithRemote.bind(this)
    );
    Events.on(
      EventType.LocalIsDisconnected,
      this.localAPIIsUndefined.bind(this)
    );
  }

  // Logic:
  async remoteJoinedMatch(data: IEchoMatchData) {
    if (
      this.currentInstanceProcessId &&
      data.local.inMatch == false &&
      data.remote.inMatch == true
    ) {
      // We are gonna close the game first
      this.close();
    }
    await this.open(data);
  }

  async remoteLeftMatch(data: IEchoMatchData) {
    // Remote left the match. Let's close Echo
    this.close();
  }

  async localIsUnsyncedWithRemote(data: IEchoNewSnapshotEventData) {
    // Ignore this event if we are currently loading into a match
    if (this.isLoadingIntoMatch) return;

    this.close();
  }

  async localAPIIsDefined() {
    this.undefinedAPICounter = 0;
    this.isLoadingIntoMatch = false;
  }

  async localAPIIsUndefined() {
    if (await this.isRunning()) {
      this.undefinedAPICounter++;
      // If after 10 API calls, the result is still undefined but Echo is running,
      // let's close Echo. Either Echo got stuck loading, or something else.
      if (this.undefinedAPICounter > 20) {
        this.close();
        this.undefinedAPICounter = 0;
      }
    }
  }

  //***********************************************************************************************/

  /**
   * Method to open EchoVR.exe with spectator stream automatically set. Using
   * the lobby id parameter allofindEchoProcessIdws the game to automatically join a specific
   * match.
   * @param snapshotData (Optional) The snapshotData for the match which to join. If not defined,
   * the game will open to a random public match.
   */
  private open = async (matchData?: IEchoMatchData) => {
    // Let's check first that we can join the snapshot
    if (!matchData) {
      return;
    }

    try {
      Events.emit(EventType.NewShadowState, ShadowStateType.JoiningRemote);
      Events.emit(EventType.LocalWillJoinMatch);
      this.isLoadingIntoMatch = true;
      const newEchoProcess = this.echoVRClient.open(matchData.sessionID);
      await this.syncPID();
    } catch (error) {
      log.error({
        message: 'error while opening echo',
        error: error.message || error,
      });
      throw error;
    }
  };

  /**
   * Method to close EchoVR.exe
   * Warning: If our current instance PID is undefined, it will close any and all intances
   * of EchoVR running on the computer, not only the instance that we opened.
   */
  private close = async () => {
    if (this.currentInstanceProcessId) {
      Events.emit(EventType.LocalWillLeaveMatch);
      await this.echoVRClient.close(this.currentInstanceProcessId);
      this.currentInstanceProcessId = undefined;
    }
  };

  /**
   * Method to return wether or not a current EchoVR process is running
   */
  private isRunning = async () => {
    try {
      await this.syncPID();
      return this.currentInstanceProcessId != undefined;
    } catch (error) {
      log.error({
        message: 'error determining running state',
        error: error.message || error,
      });
      return false;
    }
  };

  /**
   * Method used in testing to sync the method
   */
  private syncPID = async () => {
    this.currentInstanceProcessId = await this.echoVRClient.findPID();
  };

  private isJoinable = (session?: IEchoDataSnapshot) => {
    if (!session) {
      return false;
    }

    return (
      session.sessionType === EchoSessionType.Arena_Match ||
      session.sessionType === EchoSessionType.Private_Arena_Match
    );
  };
}
