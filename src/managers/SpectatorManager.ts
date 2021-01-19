import EchoInstanceClient from './EchoVRManager';
import Events from '../utilities/Events';
import { focusWindow, keyboard } from '../utilities/utils';
import { IEchoCameraController } from '../types/IEchoCameraController';
import DoNothingCameraController from '../cameraControllers/DoNothingCameraController';
import { EventType, IConfigInfo, IEchoMatchData } from '../types';
import FollowCameraController from '../cameraControllers/FollowCameraController';
import POVCameraController from '../cameraControllers/POVCameraController';

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
      case 'none':
      default:
        this.cameraController = new DoNothingCameraController();
        break;
    }
  }

  public async setDefaultSpectatorOption(matchData: IEchoMatchData) {
    await focusWindow('Echo VR');
    if (this.configData.spectatorOptions.hideUI) {
      await keyboard.keyTap('u');
    }
    this.cameraController.getDefault(matchData, keyboard);
  }

  public async updateCamera(matchData: IEchoMatchData) {
    if (!matchData || !matchData.local.inMatch) {
      return;
    }

    this.cameraController.update(matchData, keyboard);
  }
}
