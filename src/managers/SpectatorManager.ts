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

export default class SpectatorManager {
  cameraController: IEchoCameraController;

  constructor(private configData: IConfigInfo) {
    Events.on(
      EventType.LocalJoinedMatch,
      this.setDefaultSpectatorOption.bind(this)
    );
    Events.on(EventType.NewMatchData, this.updateCamera.bind(this));
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

  public async setDefaultSpectatorOption(matchData: IEchoMatchData) {
    await focusWindow('Echo VR');
    if (this.configData.spectatorOptions.hideUI) {
      await keyboard.click(Key.U);
    }
    await this.cameraController.getDefault(matchData);
  }

  public async updateCamera(matchData: IEchoMatchData) {
    if (!matchData || !matchData.local.inMatch) {
      return;
    }

    this.cameraController.update(matchData);
  }
}
