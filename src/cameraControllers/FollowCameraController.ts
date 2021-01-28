import SpectatorManager from '../managers/SpectatorManager';
import { IEchoMatchData, IEchoCameraController } from '../types';
import { keyboard, Key, delay, log } from '../utilities';
import { MatchCameraAnalyzer } from '../utilities/MatchCameraAnalyzer';

export default class FollowCameraController implements IEchoCameraController {
  cameraAnalyzer = new MatchCameraAnalyzer();
  possibleKeys: number[] = [];
  currentKeyIndex = 0;

  constructor(private target?: string) {}

  // Default
  async getDefault(
    matchData: IEchoMatchData,
    spectatorManager: SpectatorManager
  ) {
    // Provide default target name to be on remote
    if (typeof this.target === 'undefined') {
      this.target = matchData.remote.name;
    }
    // Go to the first person
    this.setPossibleKeys(matchData);
    await spectatorManager.clickFollowPlayer(
      this.possibleKeys[this.currentKeyIndex]
    );
  }

  // Updating
  async update(matchData: IEchoMatchData, spectatorManager: SpectatorManager) {
    // Provide default target name to be on remote
    if (typeof this.target === 'undefined') {
      this.target = matchData.remote.name;
    }
    // Get the current camera
    const predictedCamera = this.cameraAnalyzer.getCamera(matchData);
    if (!predictedCamera) {
      return;
    }

    log.info(`Camera is currently on: ${predictedCamera}`);
    // We need to go to the next camera
    if (predictedCamera === `${this.target!}#FOLLOW`) {
      log.info('We found the person!!');
      this.cameraAnalyzer.useHighCondifenceMode();
    } else {
      // Set the possible keys
      this.setPossibleKeys(matchData);
      // Change the camera analyzer mode
      this.cameraAnalyzer.useLowConfidenceMode();
      // Increase the current key
      this.currentKeyIndex++;
      if (this.currentKeyIndex >= this.possibleKeys.length) {
        // Loop the current key around to the start
        this.currentKeyIndex = 0;
      }
      // Keytap the new play key
      await spectatorManager.clickFollowPlayer(
        this.possibleKeys[this.currentKeyIndex]
      );
    }
  }

  setPossibleKeys(matchData: IEchoMatchData) {
    const team = this.teamForPlayer(this.target!, matchData);
    if (team === 'blue') {
      // The possible keys are the default blue keys, and only the
      // keys depending on how many players there are
      this.possibleKeys = [6, 7, 8, 9, 0].slice(
        0,
        matchData.game.bluePlayers.length
      );
    } else if (team === 'orange') {
      // The possible keys are the default orange keys, and only the
      // keys depending on how many players there are
      this.possibleKeys = [1, 2, 3, 4, 5].slice(
        0,
        matchData.game.orangePlayers.length
      );
    }
    log.info(`Set possible keys to: ${this.possibleKeys}`);
  }

  private teamForPlayer(playerName: string, matchData: IEchoMatchData) {
    const blueIndex = matchData.game.bluePlayers.findIndex(playerData => {
      return playerData.name == this.target!;
    });
    const orangeIndex = matchData.game.orangePlayers.findIndex(playerData => {
      return playerData.name == this.target!;
    });
    if (blueIndex !== -1) {
      return 'blue';
    } else if (orangeIndex !== -1) {
      return 'orange';
    } else {
      return 'unknown';
    }
  }
}
