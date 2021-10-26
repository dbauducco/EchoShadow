import EchoDataRepository from '../../repositories/EchoDataRepository';
import { sendKey, log } from '../../utilities';

export class EchoVRClientSpectatorHelper {
  constructor(public repository: EchoDataRepository) {}

  /**
   * Helper methods to control spectator camera through keysends.
   */
  public requestFollow(playerIndex: number) {
    const post_data = {
      mode: 'follow',
      num: playerIndex,
    };
    this.repository.postData(
      EchoDataRepository.CAMERA_MODE_ENDPOINT,
      post_data
    );
  }

  public requestPOV(playerIndex: number) {
    const post_data = {
      mode: 'pov',
      num: playerIndex,
    };
    this.repository.postData(
      EchoDataRepository.CAMERA_MODE_ENDPOINT,
      post_data
    );
  }

  public requestCameraByIndex(cameraIndex: number) {
    const post_data = {
      mode: 'level',
      num: cameraIndex,
    };
    this.repository.postData(
      EchoDataRepository.CAMERA_MODE_ENDPOINT,
      post_data
    );
  }

  public requestSideline() {
    const post_data = {
      mode: 'sideline',
      num: 0,
    };
    this.repository.postData(
      EchoDataRepository.CAMERA_MODE_ENDPOINT,
      post_data
    );
  }

  public setUIVisibility(visibility: boolean) {
    const post_data = {
      enabled: visibility,
    };
    this.repository.postData(
      EchoDataRepository.UI_VISIBILITY_ENDPOINT,
      post_data
    );
  }

  public listenOrange() {
    //const keyString = '{F6}';
    //sendKey(keyString, this.aggressiveness, undefined, 20, 6, 6);
  }

  public listenBlue() {
    //const keyString = '{F7}';
    //sendKey(keyString, this.aggressiveness, undefined, 20, 6, 6);
  }

  public muteAll() {
    //const keyString = '{F5}';
    //sendKey(keyString, this.aggressiveness, undefined, 20, 6, 6);
  }

  public showScoreBoard(secondsToShow: number) {
    //const keyString = '{TAB}';
    /*sendKey(
      keyString,
      this.aggressiveness,
      undefined,
      20,
      6,
      secondsToShow * 1000
    );*/
  }

  public requestAPIMode() {
    const post_data = {
      mode: 'api',
      num: 0,
    };
    this.repository.postData(
      EchoDataRepository.CAMERA_MODE_ENDPOINT,
      post_data
    );
  }
}
