import { IEchoMatchData, IEchoCameraController } from '../types';
import { keyboard, Key, delay, log } from '../utilities';
import { MatchCameraAnalyzer } from '../utilities/MatchCameraAnalyzer';

export default class FollowCameraController implements IEchoCameraController {
  cameraAnalyzer = new MatchCameraAnalyzer();
  possibleKeys: Key[] = [];
  currentKeyIndex = 0;

  constructor(private target?: string) {}

  // Default
  async getDefault(matchData: IEchoMatchData) {
    // Provide default target name to be on remote
    if (typeof this.target === 'undefined') {
      this.target = matchData.remote.name;
    }
    // Go to the first person
    this.setPossibleKeys(matchData);
    await this.goToPlayer(this.possibleKeys[this.currentKeyIndex]);
  }

  // Updating
  async update(matchData: IEchoMatchData) {
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
      await this.goToPlayer(this.possibleKeys[this.currentKeyIndex]);
    }
  }

  setPossibleKeys(matchData: IEchoMatchData) {
    const team = this.teamForPlayer(this.target!, matchData);
    if (team === 'blue') {
      // The possible keys are the default blue keys, and only the
      // keys depending on how many players there are
      this.possibleKeys = [
        Key.Num6,
        Key.Num7,
        Key.Num8,
        Key.Num9,
        Key.Num0,
      ].slice(0, matchData.game.bluePlayers.length);
    } else if (team === 'orange') {
      // The possible keys are the default orange keys, and only the
      // keys depending on how many players there are
      this.possibleKeys = [
        Key.Num1,
        Key.Num2,
        Key.Num3,
        Key.Num4,
        Key.Num5,
      ].slice(0, matchData.game.orangePlayers.length);
    }
    log.info(`Set possible keys to: ${this.possibleKeys}`);
  }

  async goToPlayer(playerKey: Key) {
    // await focusWindow('Echo VR');
    await keyboard.pressKey(Key.LeftShift, playerKey);
    await delay(500);
    await keyboard.releaseKey(Key.LeftShift, playerKey);
    log.info(`Clicked NutJS: ${playerKey}`);
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
