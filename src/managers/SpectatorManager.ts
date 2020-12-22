import EchoInstanceClient from './EchoVRManager';
import Events from '../utilities/Events';

export default class SpectatorManager {
  constructor(public echoInstance: EchoInstanceClient) {
    Events.on('localJoinedMatch', this.setDefaultSpectatorOption.bind(this));
  }

  public setDefaultSpectatorOption() {
    console.log('SpectatorManager is setting to the sideline camera.');
  }
}
