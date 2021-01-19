import { IEchoMatchData } from '../types';
import { IEchoCameraController } from '../types/IEchoCameraController';
import * as robotjs from 'robotjs';
import { MatchCameraAnalyzer } from '../utilities/MatchCameraAnalyzer';

export default class FollowCameraController implements IEchoCameraController {
  cameraAnalyzer = new MatchCameraAnalyzer();
  target = '';
  possibleKeys: number[] = [];
  currentKeyIndex = 0;

  // Default
  getDefault(matchData: IEchoMatchData, keyboard: typeof robotjs) {
    this.setPossibleKeys(matchData);
    this.goToPlayer(this.possibleKeys[this.currentKeyIndex], keyboard);
  }

  // Updating
  update(matchData: IEchoMatchData, keyboard: typeof robotjs) {
    // Get the current camera
    const predictedCamera = this.cameraAnalyzer.getCamera(matchData);
    if (!predictedCamera) {
      return;
    }

    console.log('Camera is currently on: ' + predictedCamera);
    // We need to go to the next camera
    if (predictedCamera !== matchData.remote.name + '#FOLLOW') {
      // Set the possible keys
      this.setPossibleKeys(matchData);
      // Increase the current key
      this.currentKeyIndex++;
      if (this.currentKeyIndex >= this.possibleKeys.length) {
        // Loop the current key around to the start
        this.currentKeyIndex = 0;
      }
      // Keytap the new play key
      this.goToPlayer(this.possibleKeys[this.currentKeyIndex], keyboard);
    }
  }

  setPossibleKeys(matchData: IEchoMatchData) {
    if (matchData.remote.team === 'blue') {
      // The possible keys are the default blue keys, and only the
      // keys depending on how many players there are
      this.possibleKeys = [6, 7, 8, 9, 0].slice(
        0,
        matchData.game.bluePlayers.length
      );
    } else if (matchData.remote.team === 'orange') {
      // The possible keys are the default orange keys, and only the
      // keys depending on how many players there are
      this.possibleKeys = [1, 2, 3, 4, 5].slice(
        0,
        matchData.game.bluePlayers.length
      );
    }
    console.log('Set possible keys to: ' + this.possibleKeys);
  }

  goToPlayer(playerNumber: number, keyboard: typeof robotjs) {
    console.log('Clicked: SHIFT+' + playerNumber);
    //keyboard.keyTap('' + playerNumber, 'shift');
    keyboard.keyToggle('' + playerNumber, 'down', 'shift');
    setTimeout(() => {
      keyboard.keyToggle('' + playerNumber, 'up', 'shift');
    }, 1000);
  }
}
