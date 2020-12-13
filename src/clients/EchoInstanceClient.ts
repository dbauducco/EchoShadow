import { getProcessId, log } from '../utilities';
import { EchoSessionType, IEchoDataSnapshot } from '../types';
import EchoExeClient from './EchoExeClient';

export default class EchoInstanceClient {
  private exeRepository: EchoExeClient;

  private currentInstanceProcessId: string | undefined;

  constructor(echoPath: string) {
    this.exeRepository = new EchoExeClient(echoPath);
  }

  /**
   * Method to open EchoVR.exe with spectator stream automatically set. Using
   * the lobby id parameter allows the game to automatically join a specific
   * match.
   * @param snapshotData (Optional) The snapshotData for the match which to join. If not defined,
   * the game will open to a random public match.
   */
  open = async (snapshotData?: IEchoDataSnapshot) => {
    const sessionID = this.isJoinable(snapshotData)
      ? snapshotData?.sessionId
      : undefined;
    await this.exeRepository.open(sessionID);
    this.currentInstanceProcessId = await this.findEchoProcessId();
  };

  /**
   * Method to close EchoVR.exe
   * Warning: If our current instance PID is undefined, it will close any and all intances
   * of EchoVR running on the computer, not only the instance that we opened.
   */
  close = async () => {
    if (this.currentInstanceProcessId) {
      await this.exeRepository.close(this.currentInstanceProcessId);
      this.currentInstanceProcessId = undefined;
    }
  };

  /**
   * Method to get the PID of the current instance of EchoVR.exe
   */
  private findEchoProcessId = async () => {
    const echoPid = await getProcessId('echovr.exe');
    return echoPid;
  };

  /**
   * Method to return wether or not a current EchoVR process is running
   */
  isRunning = async () => {
    try {
      await this.syncPID();
      return this.currentInstanceProcessId !== undefined;
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
    this.currentInstanceProcessId = await this.findEchoProcessId();
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
