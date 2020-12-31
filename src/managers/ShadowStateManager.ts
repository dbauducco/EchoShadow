import { IConfigInfo } from '../types';
import { BrowserWindow, ipcMain } from 'electron';
import Events from '../utilities/Events';
import { DeviceStatusEnum } from '../../app/types';
import { EventType } from '../types/EventType';
import { config } from 'winston';
import { ShadowStateType } from '../types/ShadowStateType';

export default class ShadowStateManager {
  shadowState = {
    statusMessage: 'Starting up EchoShadow...',
    remoteStatus: DeviceStatusEnum.Inactive,
    localStatus: DeviceStatusEnum.Inactive,
    localIp: 'Loading',
    remoteIp: 'Loading',
    locked: false,
    currentState: ShadowStateType.StartingUp,
  };

  constructor(intialConfig: IConfigInfo) {
    // Setting initial values from config
    this.shadowState.localIp = intialConfig.localApiIpAddress;
    this.shadowState.remoteIp = intialConfig.remoteApiIpAddress;
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
    if (
      this.shadowState.currentState !== ShadowStateType.WaitingForRemoteData
    ) {
      Events.emit(
        EventType.NewShadowState,
        ShadowStateType.WaitingForRemoteData
      );
    }
  }

  newShadowState(data: ShadowStateType) {
    if (this.shadowState.locked) {
      // Let's not do any updating if we've hit a locked state
      return;
    }

    this.shadowState.statusMessage = data;
    this.shadowState.currentState = data;

    if (data == ShadowStateType.InvalidEchoPath) {
      this.shadowState.localStatus = DeviceStatusEnum.Error;
      this.shadowState.locked = true;
    }
  }
}
