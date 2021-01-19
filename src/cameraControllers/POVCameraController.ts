import { IEchoMatchData, IEchoCameraController } from '../types';
import { keyboard, Key } from '../utilities/utils';
import * as robotjs from 'robotjs';
import { focusWindow } from '../utilities';
import { copySync } from 'fs-extra';

export default class POVCameraController implements IEchoCameraController {
  currentSpectatingIndex = -1;
  ignoreCounter = 40;

  // Difference Thresholds
  POV_DIFF_THRESHOLD = 0.11;

  // Default camera setup
  getDefault(matchData: IEchoMatchData, keyboard: typeof robotjs) {
    if (matchData.remote.team == 'orange') {
      this.currentSpectatingIndex = matchData.remote.index + 1;
    } else if (matchData.remote.team == 'blue') {
      this.currentSpectatingIndex = matchData.remote.index + 6;
    }

    // Just in case, map 10 => 0
    if (this.currentSpectatingIndex == 10) {
      this.currentSpectatingIndex = 0;
    }
    this.pressKeysFor(this.currentSpectatingIndex, keyboard);
  }

  // Updating camera setup
  async update(matchData: IEchoMatchData, keyboard: typeof robotjs) {
    const predictedCamera = this.getCameraPosition(matchData);
    if (predictedCamera) {
      console.log(predictedCamera);
    }
  }

  async goToNext(matchData: IEchoMatchData, keyboard: typeof robotjs) {
    this.currentSpectatingIndex++;
    // Map 10 => 0
    if (this.currentSpectatingIndex == 10) {
      this.currentSpectatingIndex = 0;
    }
    // Reset to the start of the players
    if (this.currentSpectatingIndex == 1 || this.currentSpectatingIndex == 6) {
      switch (matchData.remote.team) {
        case 'blue':
          this.currentSpectatingIndex = 6;
          break;
        case 'orange':
          this.currentSpectatingIndex = 1;
          break;
        default:
          this.currentSpectatingIndex = 1;
          break;
      }
    }
    // Go to the new player
    console.log('Going to player: ' + this.currentSpectatingIndex);
    this.pressKeysFor(this.currentSpectatingIndex, keyboard);
  }

  async pressKeysFor(playerIndex: number, keyboard: typeof robotjs) {
    await focusWindow('Echo VR');
    keyboard.keyToggle('' + this.currentSpectatingIndex, 'down', 'shift');
    setTimeout(() => {
      keyboard.keyToggle('' + this.currentSpectatingIndex, 'up', 'shift');
      keyboard.keyToggle('p', 'down');
      setTimeout(() => {
        keyboard.keyToggle('p', 'up');
      }, 1000);
    }, 1000);
  }

  getCameraPosition(matchData: IEchoMatchData) {
    const player = matchData.game.bluePlayers[0];
    var predictedCamera: string | undefined = undefined;

    //for (const playerIndex in matchData.game.bluePlayers) {
    //const player = matchData.game.bluePlayers[playerIndex];

    const x_diff = Math.abs(player.position[0] - matchData.local.position[0]);
    const y_diff = Math.abs(player.position[1] - matchData.local.position[1]);
    const z_diff = Math.abs(player.position[2] - matchData.local.position[2]);

    if (
      x_diff < this.POV_DIFF_THRESHOLD &&
      y_diff < this.POV_DIFF_THRESHOLD &&
      z_diff < this.POV_DIFF_THRESHOLD
    ) {
      predictedCamera = player.name + '#POV';
      return predictedCamera;
    }
    return predictedCamera;
  }
}
