import { prettyDOM } from '@testing-library/react';
import { IEchoMatchData, IEchoMatchPlayerData } from '../types';

export class MatchCameraAnalyzer {
  // Class Constants
  MINIMUM_PREDICTION_THRESHOLD = 10;
  RESET_PREDICTION_THRESHOLD = 30;
  MINIMUM_ACCURACY_THRESHOLD = 0.6;
  FOLLOW_X_DIFF_THRESHOLD = 2;
  FOLLOW_Y_DIFF_THRESHOLD = 0.67;
  FOLLOW_Z_DIFF_THRESHOLD = 6;
  POV_DIFF_THRESHOLD = 0.11;
  // Changing variables
  predictions: { [cameraName: string]: number } = {};

  /**
   * Returns the string of the camera on which it thinks we are currently on. If it is not confident yet, it will return undefined.
   * @param matchData The match data which to analyze
   */
  public getCamera(matchData: IEchoMatchData): string | undefined {
    // Predict the camera
    this.predictCurrentCamera(matchData);

    // Make sure predictions exist
    if (Object.values(this.predictions).length == 0) {
      return undefined;
    }

    // Check the current number of predictions
    const numPredictions = this.getNumberOfPredictions();

    // Check if we have a large enough sample yet
    if (numPredictions < this.MINIMUM_PREDICTION_THRESHOLD) {
      return undefined;
    }

    if (numPredictions > this.RESET_PREDICTION_THRESHOLD) {
      this.predictions = {};
      return undefined;
    }

    // Check if any of the objects are over the mininum required threshold
    for (let [camera, count] of Object.entries(this.predictions)) {
      if (count / numPredictions >= this.MINIMUM_ACCURACY_THRESHOLD) {
        this.predictions = {};
        return camera;
      }
    }

    // No values were over the required threshold
    return undefined;
  }

  /**
   * Set's the MatchCameraAnalyzer into low confidence mode, which will return estimates quicker at the expense of accuracy.
   */
  public useLowConfidenceMode() {
    this.MINIMUM_PREDICTION_THRESHOLD = 10;
    this.RESET_PREDICTION_THRESHOLD = 30;
    this.MINIMUM_ACCURACY_THRESHOLD = 0.6;
  }

  /**
   * Set's the MatchCameraAnalyzer into high confidence mode, which will return more accurate estimates at the expense of accuracy.
   */
  public useHighCondifenceMode() {
    this.MINIMUM_PREDICTION_THRESHOLD = 29;
    this.RESET_PREDICTION_THRESHOLD = 30;
    this.MINIMUM_ACCURACY_THRESHOLD = 0.9;
  }

  /********* PRIVATE HELPER FUNCTIONS *********/
  private predictCurrentCamera(matchData: IEchoMatchData) {
    const oldPredictionCount = this.getNumberOfPredictions();
    for (const playerIndex in matchData.game.bluePlayers) {
      this.checkCameraOnPlayer(
        matchData,
        matchData.game.bluePlayers[playerIndex]
      );
    }
    for (const playerIndex in matchData.game.orangePlayers) {
      this.checkCameraOnPlayer(
        matchData,
        matchData.game.orangePlayers[playerIndex]
      );
    }
    if (this.getNumberOfPredictions() == oldPredictionCount) {
      // No new predictions were added
      this.addPrediction('#UNKNOWN');
    }
  }

  private checkCameraOnPlayer(
    matchData: IEchoMatchData,
    playerData: IEchoMatchPlayerData
  ) {
    const pos_x_diff = Math.abs(
      playerData.head!.position[0] - matchData.local.position[0]
    );
    const pos_y_diff = Math.abs(
      playerData.head!.position[1] - matchData.local.position[1]
    );
    const pos_z_diff = Math.abs(
      playerData.head!.position[2] - matchData.local.position[2]
    );

    // Check POV
    if (
      pos_x_diff < this.POV_DIFF_THRESHOLD &&
      pos_y_diff < this.POV_DIFF_THRESHOLD &&
      pos_z_diff < this.POV_DIFF_THRESHOLD
    ) {
      this.addPrediction(playerData.name + '#POV');
    }
    // Check FOLLOW
    else if (
      pos_x_diff < this.FOLLOW_X_DIFF_THRESHOLD &&
      pos_y_diff < this.FOLLOW_Y_DIFF_THRESHOLD &&
      pos_z_diff < this.FOLLOW_Z_DIFF_THRESHOLD
    ) {
      if (matchData.local.forward[2] < 0) {
        // Facing blue
        if (playerData.head!.position[2] < matchData.local.position[2]) {
          this.addPrediction(playerData.name + '#FOLLOW');
        }
      } else if (matchData.local.forward[2] > 0) {
        // Facing orange
        if (playerData.head!.position[2] > matchData.local.position[2]) {
          this.addPrediction(playerData.name + '#FOLLOW');
        }
      }
    }
  }

  private addPrediction(cameraName: string) {
    const previousCount = this.predictions[cameraName];
    if (previousCount) {
      this.predictions[cameraName] = previousCount + 1;
    } else {
      this.predictions[cameraName] = 1;
    }
  }

  private getNumberOfPredictions() {
    if (Object.keys(this.predictions).length == 0) {
      return 0;
    }
    return Object.values(this.predictions).reduce((a, b) => a + b);
  }
}
