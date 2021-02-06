import { sendKey, log } from '../../utilities';

export class EchoVRClientSpectatorHelper {
  constructor(public aggressiveness: number) {}

  /**
   * Helper methods to control spectator camera through keysends.
   */
  public requestFollowByIndex(playerIndex: number) {
    const keyString = `+${playerIndex} `;
    sendKey(keyString, this.aggressiveness, undefined, 0, 0, 6);
    log.info(`[EchoVRClient] Went to player: ${playerIndex}`);
  }

  public requestFollow() {
    const keyString = 'f';
    sendKey(keyString, this.aggressiveness, undefined, 0, 1, 6);
    log.info('[EchoVRClient] Clicked follow');
  }

  public requestPOV() {
    const keyString = 'p';
    sendKey(keyString, this.aggressiveness, undefined, 0, 1, 6);
    log.info('[EchoVRClient] Clicked pov');
  }

  public requestCameraByIndex(cameraIndex: number) {
    const keyString = `^^${cameraIndex} `;
    sendKey(keyString, this.aggressiveness, undefined, 0, 0, 6);
    log.info(`[EchoVRClient] Went to camera: ${cameraIndex}`);
  }

  public requestSideline() {
    const keyString = 's';
    sendKey(keyString, this.aggressiveness, undefined, 100, 6, 1);
  }

  public requestUIToggle() {
    const keyString = 'u';
    sendKey(keyString, this.aggressiveness, undefined, 20, 6, 6);
  }

  public listenOrange() {
    const keyString = '{F6}';
    sendKey(keyString, this.aggressiveness, undefined, 20, 6, 6);
  }

  public listenBlue() {
    const keyString = '{F7}';
    sendKey(keyString, this.aggressiveness, undefined, 20, 6, 6);
  }

  public muteAll() {
    const keyString = '{F5}';
    sendKey(keyString, this.aggressiveness, undefined, 20, 6, 6);
  }

  public showScoreBoard(secondsToShow: number) {
    const keyString = '{TAB}';
    sendKey(
      keyString,
      this.aggressiveness,
      undefined,
      20,
      6,
      secondsToShow * 1000
    );
  }
}
