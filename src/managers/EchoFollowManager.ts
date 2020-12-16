import EchoDataRepository from '../repositories/EchoDataRepository';
import { EchoSessionType, IEchoDataSnapshot } from '../types';
import EchoInstanceClient from '../clients/EchoInstanceClient';
import { log } from '../utilities/log';
import { ipcMain, BrowserWindow } from 'electron';

export default class EchoFollowManager {
  // Settings for the EchoFollowManager
  WAIT_TIME_SECONDS = 5;
  localTimedOutCounter = 0;
  shadowStatus = {
    statusMessage: '',
    remoteStatus: '',
    localStatus: '',
  };

  constructor(
    public remoteDataRepository: EchoDataRepository,
    public localDataRepository: EchoDataRepository,
    public echoInstanceClient: EchoInstanceClient
  ) {}

  public async handleFollowLogic(
    remoteDataSnapshot?: IEchoDataSnapshot,
    localDataSnapshot?: IEchoDataSnapshot
  ) {
    log.debug('before echoInstanceClient.isRunning');
    // Let's cache the result to prevent multiple calls
    const isEchoRunning = await this.echoInstanceClient.isRunning();
    log.debug('after echoInstanceClient.isRunning');

    // Update status
    if (isEchoRunning)
      if (isEchoRunning && !localDataSnapshot) {
        if (this.localTimedOutCounter <= 4) {
          // Scenario 1.8
          log.info({ scenario: '1.8', action: 'none' });
          this.localTimedOutCounter++;
          return undefined;
        }
        // Scenario 1.9
        log.info({ scenario: '1.9', action: 'close' });
        this.localTimedOutCounter = 0;
        await this.echoInstanceClient.close();
        this.shadowStatus.statusMessage = 'Relaunching Echo...';
        return undefined;
      }
    // Reset counter and continue with checks
    this.localTimedOutCounter = 0;

    // Scenario 1.7
    if (isEchoRunning && !remoteDataSnapshot) {
      log.info({ scenario: '1.7', action: 'close' });
      await this.echoInstanceClient.close();
      this.shadowStatus.statusMessage = 'Closed Echo';
      return undefined;
    }

    // Scenario 1.5
    if (!isEchoRunning && !remoteDataSnapshot) {
      log.info({ scenario: '1.5', action: 'none' });
      this.shadowStatus.statusMessage = 'Waiting for player data...';
      return undefined;
    }

    if (!isEchoRunning && remoteDataSnapshot) {
      // Scenario 1.1
      if (this.isJoinable(remoteDataSnapshot.sessionType)) {
        log.info({ scenario: '1.1', action: 'open' });
        await this.echoInstanceClient.open(remoteDataSnapshot);
        log.debug({ message: 'after echoInstanceClient.open' });
        this.shadowStatus.statusMessage = 'Launching Echo...';
        return undefined;
      }
      // Scenario 1.6
      log.info({ scenario: '1.6', action: 'none' });
      this.shadowStatus.statusMessage = 'Waiting for player to join match...';
      return undefined;
    }

    if (localDataSnapshot && remoteDataSnapshot) {
      if (localDataSnapshot.sessionId === remoteDataSnapshot.sessionId) {
        // Scenario 1.3
        log.info({ scenario: '1.3', action: 'none' });
        this.shadowStatus.statusMessage = 'Synced';
        return undefined;
      }
      // Scenario 1.4 && Scenario 1.2
      log.info({ scenario: '1.4 && 1.2', action: 'close and open' });
      await this.echoInstanceClient.close();
      await this.echoInstanceClient.open(remoteDataSnapshot);
      this.shadowStatus.statusMessage = 'Relaunching Echo...';
      return undefined;
    }

    // ???? What the heck? What did we miss?
    log.info({
      scenario: 'calm screwed up',
      action: 'fix it',
      localDataSnapshot,
      remoteDataSnapshot,
    });
    return undefined;
  }

  public startFollowing() {
    try {
      setTimeout(async () => {
        const remoteDataSnapshot = await this.remoteDataRepository.getSnapshot();
        const localDataSnapshot = await this.localDataRepository.getSnapshot();

        log.info({
          remoteDataSnapshot: remoteDataSnapshot || null,
          localDataSnapshot: localDataSnapshot || null,
        });

        await this.handleFollowLogic(remoteDataSnapshot, localDataSnapshot);
        await this.startFollowing();

        BrowserWindow.getFocusedWindow()?.webContents.send(
          'shadowStatusUpdate',
          this.shadowStatus
        );
      }, this.WAIT_TIME_SECONDS * 1000);
    } catch (error) {
      log.error({
        message: 'error while performing follow logic',
        error: error.message || error,
      });
      throw error;
    }
  }

  private isJoinable(sessionType: EchoSessionType) {
    return (
      sessionType === EchoSessionType.Arena_Match ||
      sessionType === EchoSessionType.Private_Arena_Match
    );
  }
}
