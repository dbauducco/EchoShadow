// Typescript is stupid sometimes so we are just going to "require" instead of "import" this to avoid compiling errors
const processWindows = require('node-process-windows');

import { promisify } from 'util';
import { EchoSessionType, IEchoDataSnapshot } from '../types';
import EchoExeClient from './EchoExeClient';

export default class EchoInstanceClient {
  private exeRepository: EchoExeClient;
  private currentInstanceProcess: any | undefined;

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
    this.currentInstanceProcess = await this.findProcess();
  };

  /**
   * Method to close EchoVR.exe
   * Warning: If our current instance PID is undefined, it will close any and all intances
   * of EchoVR running on the computer, not only the instance that we opened.
   */
  close = async () => {
    await this.exeRepository.close(this.currentInstanceProcess);
    this.currentInstanceProcess = undefined;
  };

  /**
   * Method to get the PID of the current instance of EchoVR.exe
   */
  private findProcess = async () => {
    const getActiveProcesses = promisify(processWindows.getProcesses);
    const runningProcesses = await getActiveProcesses();
    const echoProcess = runningProcesses.find(
      (p: { processName: string }) => p.processName == 'echovr'
    );
    return echoProcess;
  };

  /**
   * Method to return wether or not a current EchoVR process is running
   */
  isRunning = async () => {
    await this.syncPID();
    return this.currentInstanceProcess !== undefined;
  };

  /**
   * Method used in testing to sync the method
   */
  private syncPID = async () => {
    this.currentInstanceProcess = await this.findProcess();
  };

  private isJoinable = (session?: IEchoDataSnapshot) => {
    if (!session) {
      return false;
    }

    return (
      session.sessionType == EchoSessionType.Arena_Match ||
      session.sessionType == EchoSessionType.Private_Arena_Match
    );
  };
}
