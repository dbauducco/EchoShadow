import EchoInstanceClient from './EchoVRManager';
import Events from '../utilities/Events';
import { focusWindow, keyboard } from '../utilities/utils';
import { IEchoCameraController } from '../types/IEchoCameraController';
import DoNothingCameraController from '../cameraControllers/DoNothingCameraController';
import { EventType, IEchoMatchData } from '../types';

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
    this.cameraController = new DoNothingCameraController();
  }

  public async setDefaultSpectatorOption(matchData: IEchoMatchData) {
    //await keyboard.keyTap('u');
    this.cameraController.getDefault(matchData, keyboard);
  }

  public async updateCamera(matchData: IEchoMatchData) {
    if (!matchData || !matchData.isRemoteInMatch) {
      return;
    }

    this.cameraController.update(matchData, keyboard);
  }

  private async typeKeys(keysToType: { key: string; modifier?: string }[]) {
    //await focusWindow('Echo VR');
    for (const entry of keysToType) {
      console.log('Typing key!!! ' + entry.key);
      if (entry.modifier) {
        await keyboard.keyTap(entry.key, entry.modifier);
      } else {
        await keyboard.keyTap(entry.key);
      }
    }
  }
}
