import EchoInstanceClient from './EchoVRManager';
import Events from '../utilities/Events';
import { IEchoCameraController } from '../types/IEchoCameraController';
import DoNothingCameraController from '../cameraControllers/DoNothingCameraController';
import { EventType, IEchoMatchData } from '../types';
import SidelineCameraController from '../cameraControllers/SidelineCameraController';
import POVCameraController from '../cameraControllers/POVCameraController';
import FollowCameraController from '../cameraControllers/FollowCameraController';
import DiscCameraController from '../cameraControllers/DiscCameraController';
import { focusWindow, Key, keyboard } from '../utilities/utils';

export default class SpectatorManager {
  cameraController: IEchoCameraController;

  constructor(public echoInstance: EchoInstanceClient) {
    // Events.on(
    //   EventType.LocalJoinedMatch,
    //   this.setDefaultSpectatorOption.bind(this)
    // );
    // Events.on(EventType.NewMatchData, this.updateCamera.bind(this));
    Events.on(
      EventType.TestLocalJoinedMatch,
      this.setDefaultSpectatorOption.bind(this)
    );
    Events.on(EventType.TestNewMatchData, this.updateCamera.bind(this));
    this.cameraController = new POVCameraController();
  }

  public async setDefaultSpectatorOption(matchData: IEchoMatchData) {
    await focusWindow('Echo VR');
    await keyboard.click(Key.U);
    this.cameraController.getDefault(matchData);
  }

  public async updateCamera(matchData: IEchoMatchData) {
    if (!matchData || !matchData.isRemoteInMatch) {
      return;
    }

    this.cameraController.update(matchData);
  }
}
