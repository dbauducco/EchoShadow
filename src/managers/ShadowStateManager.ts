import { ipcMain } from 'electron';
import { IConfigInfo } from '../types';
import Events from '../utilities/Events';
import { DeviceStatusEnum } from '../../app/types';
import { EventType } from '../types/EventType';
import { ShadowStateType } from '../types/ShadowStateType';
import { version as appVersion } from '../../package.json';

export default class ShadowStateManager {
  shadowState = {
    statusMessage: `Starting up EchoShadow v${appVersion}...`,
    remoteStatus: DeviceStatusEnum.Inactive,
    localStatus: DeviceStatusEnum.Inactive,
    localIp: 'Loading',
    remoteIp: 'Loading',
    locked: false,
    currentState: ShadowStateType.StartingUp,
  };

  constructor(intialConfig: IConfigInfo) {
    // Setting initial values from config
    this.shadowState.localIp = intialConfig.network.localIP;
    this.shadowState.remoteIp = intialConfig.network.questIP;
    this.shadowState.localStatus = DeviceStatusEnum.Nominal;

    // Registering for events
    Events.on(EventType.RemoteIsConnected, this.remoteIsConnected.bind(this));
    Events.on(
      EventType.RemoteIsDisconnected,
      this.remoteIsDisconnected.bind(this)
    );
    Events.on(EventType.NewShadowState, this.newShadowState.bind(this));

    // Creating the response to a status UI update event
    ipcMain.handle('shadowStatusUpdate', async () => {
      return this.shadowState;
    });
  }

  remoteIsConnected() {
    this.shadowState.remoteStatus = DeviceStatusEnum.Nominal;
  }

  remoteIsDisconnected() {
    this.shadowState.remoteStatus = DeviceStatusEnum.Inactive;
  }

  newShadowState(data: ShadowStateType) {
    if (this.shadowState.locked) {
      // Let's not do any updating if we've hit a locked state
      return;
    }

    this.shadowState.statusMessage = data;
    this.shadowState.currentState = data;

    if (
      data == ShadowStateType.InvalidEchoPath ||
      data == ShadowStateType.EchoIsNotInstalled
    ) {
      this.shadowState.localStatus = DeviceStatusEnum.Error;
      this.shadowState.locked = true;
    }
  }
}
