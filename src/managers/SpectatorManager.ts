import EchoInstanceClient from './EchoVRManager';
import Events from '../utilities/Events';
import { IEchoCameraController } from '../types/IEchoCameraController';
import DoNothingCameraController from '../cameraControllers/DoNothingCameraController';
import { EventType, IConfigInfo, IEchoMatchData } from '../types';
import FollowCameraController from '../cameraControllers/FollowCameraController';
import DiscCameraController from '../cameraControllers/DiscCameraController';
import { focusWindow, Key, keyboard } from '../utilities/utils';
import POVCameraController from '../cameraControllers/POVCameraController';
import SidelineCameraController from '../cameraControllers/SidelineCameraController';
import sendKey from '../utilities/KeySender';
import { log } from '../utilities';

export default class SpectatorManager {
  cameraController: IEchoCameraController;

  constructor(private configData: IConfigInfo) {
    Events.on(
      EventType.LocalJoinedMatch,
      this.setDefaultSpectatorOption.bind(this)
    );
    Events.on(EventType.NewMatchData, this.updateCamera.bind(this));
    Events.on(
      EventType.NewSpectatorTarget,
      this.setNewSpectatorTarget.bind(this)
    );
    switch (configData.spectatorOptions.mode) {
      case 'follow':
        this.cameraController = new FollowCameraController();
        break;
      case 'pov':
        this.cameraController = new POVCameraController();
        break;
      case 'sideline':
        this.cameraController = new SidelineCameraController();
        break;
      case 'none':
      default:
        this.cameraController = new DoNothingCameraController();
        break;
    }
  }

  private async setDefaultSpectatorOption(matchData: IEchoMatchData) {
    await focusWindow('Echo VR');
    if (this.configData.spectatorOptions.hideUI) {
      this.clickUI();
    }
    await this.cameraController.getDefault(matchData, this);
  }

  /**
   * Method that recieves the updates on game data and passes it on
   * to the cameraControllers
   */
  private async updateCamera(matchData: IEchoMatchData) {
    if (!matchData || !matchData.local.inMatch) {
      return;
    }

    this.cameraController.update(matchData, this);
  }

  /**
   * Method that receives requests from other components to change
   * the current spectator controls
   * @param targetName
   */
  private async setNewSpectatorTarget(targetName: string) {
    const targetParsed = targetName.split('#');
    const targetPlayer = targetParsed[0];
    const targetType = targetParsed[1];
    console.log('Requested new spectator target: ' + targetName);
    if (targetType === 'FOLLOW') {
      this.cameraController = new FollowCameraController(targetPlayer);
    } else if (targetType === 'POV') {
      this.cameraController = new POVCameraController(targetPlayer);
    }
  }

  /**
   * Helper methods to control spectator camera through keysends.
   */
  public clickFollowPlayer(playerIndex: number) {
    const partialKeyString = '+' + playerIndex;
    const keyString =
      partialKeyString + ' ' + partialKeyString + ' ' + partialKeyString;
    sendKey(keyString, 'Echo VR', 0, 0, 6);
    log.info('[SPECTATOR_MANAGER] Went to player: ' + playerIndex);
  }

  public clickFollow() {
    const keyString = 'ffff';
    sendKey(keyString, 'Echo VR', 0, 1, 6);
    log.info('[SPECTATOR_MANAGER] Clicked follow');
  }

  public clickPOV() {
    const keyString = 'pppp';
    sendKey(keyString, 'Echo VR', 0, 1, 6);
    log.info('[SPECTATOR_MANAGER] Clicked pov');
  }

  public clickCamera(cameraIndex: number) {
    const partialKeyString = '^^' + cameraIndex;
    const keyString =
      partialKeyString + ' ' + partialKeyString + ' ' + partialKeyString;
    sendKey(partialKeyString, 'Echo VR', 0, 0, 6);
    log.info('[SPECTATOR_MANAGER] Went to camera: ' + cameraIndex);
  }

  public clickSideline() {
    //const keyString = 'sssss';
    //sendKey(keyString, 'Echo VR', 100, 6, 1);
  }

  public clickUI() {
    const keyString = 'uuuuu';
    sendKey(keyString, 'Echo VR', 20, 6, 6);
  }
}
