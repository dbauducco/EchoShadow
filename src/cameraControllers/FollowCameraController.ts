import { IEchoMatchData } from '../types';
import { IEchoCameraController } from '../types/IEchoCameraController';
import * as robotjs from 'robotjs';
import { MatchCameraAnalyzer } from '../utilities/MatchCameraAnalyzer';

export default class FollowCameraController implements IEchoCameraController {
  // Setting Variables
  FOLLOW_X_DIFF_THRESHOLD = 2;
  FOLLOW_Y_DIFF_THRESHOLD = 0.67;
  FOLLOW_Z_DIFF_THRESHOLD = 6;
  cameraAnalyzer = new MatchCameraAnalyzer();
  // Default
  getDefault(matchData: IEchoMatchData, keyboard: typeof robotjs) {
    keyboard.keyTap('' + matchData.remote.index, 'shift');
  }
  // Updating
  update(matchData: IEchoMatchData, keyboard: typeof robotjs) {
    const predictedCamera = this.cameraAnalyzer.getCamera(matchData);
    if (predictedCamera) {
      console.log(predictedCamera);
    }
  }

  getCameraPosition(matchData: IEchoMatchData) {
    //const player = matchData.game.bluePlayers[0];
    var predictedCameras: string[] = [];

    for (const playerIndex in matchData.game.bluePlayers) {
      const player = matchData.game.bluePlayers[playerIndex];

      const pos_x_diff = Math.abs(
        player.position[0] - matchData.local.position[0]
      );
      const pos_y_diff = Math.abs(
        player.position[1] - matchData.local.position[1]
      );
      const pos_z_diff = Math.abs(
        player.position[2] - matchData.local.position[2]
      );

      if (
        pos_x_diff < this.FOLLOW_X_DIFF_THRESHOLD &&
        pos_y_diff < this.FOLLOW_Y_DIFF_THRESHOLD &&
        pos_z_diff < this.FOLLOW_Z_DIFF_THRESHOLD
      ) {
        if (matchData.local.forward[2] < 0) {
          // Facing blue
          if (player.position[2] < matchData.local.position[2]) {
            predictedCameras.push(player.name + '#FOLLOW');
          }
        } else if (matchData.local.forward[2] > 0) {
          // Facing orange
          if (player.position[2] > matchData.local.position[2]) {
            predictedCameras.push(player.name + '#FOLLOW');
          }
        }
      }
    }

    return predictedCameras;
  }
}
