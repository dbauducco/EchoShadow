import EchoDataRepository from '../repositories/EchoDataRepository';
import { EchoSessionType, IEchoDataSnapshot } from '../types';
import EchoInstanceClient from '../clients/EchoInstanceClient';
import { log } from '../utilities/log';

export default class EchoFollowManager {
  // Settings for the EchoFollowManager
  WAIT_TIME_SECONDS = 5;

  localTimedOutCounter = 0;

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
      return undefined;
    }
    // Reset counter and continue with checks
    this.localTimedOutCounter = 0;

    // Scenario 1.7
    if (isEchoRunning && !remoteDataSnapshot) {
      log.info({ scenario: '1.7', action: 'close' });
      await this.echoInstanceClient.close();
      return undefined;
    }

    // Scenario 1.5
    if (!isEchoRunning && !remoteDataSnapshot) {
      log.info({ scenario: '1.5', action: 'none' });
      return undefined;
    }

    if (!isEchoRunning && remoteDataSnapshot) {
      // Scenario 1.1
      if (this.isJoinable(remoteDataSnapshot.sessionType)) {
        log.info({ scenario: '1.1', action: 'open' });
        await this.echoInstanceClient.open(remoteDataSnapshot);
        return undefined;
      }
      // Scenario 1.6
      log.info({ scenario: '1.6', action: 'none' });
      return undefined;
    }

    if (localDataSnapshot && remoteDataSnapshot) {
      if (localDataSnapshot.sessionId === remoteDataSnapshot.sessionId) {
        // Scenario 1.3
        log.info({ scenario: '1.3', action: 'none' });
        return undefined;
      }
      // Scenario 1.4 && Scenario 1.2
      log.info({ scenario: '1.4 && 1.2', action: 'close and open' });
      await this.echoInstanceClient.close();
      await this.echoInstanceClient.open(remoteDataSnapshot);
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
    setTimeout(async () => {
      const remoteDataSnapshot = await this.remoteDataRepository.getSnapshot();
      const localDataSnapshot = await this.localDataRepository.getSnapshot();

      log.info({
        remoteDataSnapshot: remoteDataSnapshot || null,
        localDataSnapshot: localDataSnapshot || null,
      });

      await this.handleFollowLogic(remoteDataSnapshot, localDataSnapshot);
      await this.startFollowing();
    }, this.WAIT_TIME_SECONDS * 1000);
  }

  private isJoinable(sessionType: EchoSessionType) {
    return (
      sessionType === EchoSessionType.Arena_Match ||
      sessionType === EchoSessionType.Private_Arena_Match
    );
  }
}
