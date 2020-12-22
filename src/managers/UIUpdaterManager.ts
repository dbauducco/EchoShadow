import { IConfigInfo } from '../types';
import { BrowserWindow } from 'electron';
import Events from '../utilities/Events';
import { DeviceStatusEnum } from '../../app/types';
import { EventType } from '../types/EventType';
import { config } from 'winston';
import { ShadowStateType } from '../types/ShadowStateType';

export default class UIUpdaterMananger {
  shadowState = {
    statusMessage: 'Starting Up EchoShadow...',
    remoteStatus: DeviceStatusEnum.Inactive,
    localStatus: DeviceStatusEnum.Inactive,
    localIp: 'Loading',
    remoteIp: 'Loading',
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

    // Sending intial UI update
    this.updateUI();
  }

  updateUI() {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.webContents.send('shadowStatusUpdate', this.shadowState);
    }
  }

  remoteIsConnected() {
    this.shadowState.remoteStatus = DeviceStatusEnum.Nominal;
    this.updateUI();
  }

  remoteIsDisconnected() {
    this.shadowState.remoteStatus = DeviceStatusEnum.Inactive;
    this.updateUI();
  }

  newShadowState(data: ShadowStateType) {
    this.shadowState.statusMessage = data;
    this.updateUI();
  }
}
