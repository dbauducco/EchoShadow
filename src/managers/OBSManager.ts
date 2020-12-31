import Events from '../utilities/Events';

export default class OBSManager {
  constructor() {
    //Events.on('localJoinedMatch', this.goToMatchScene.bind(this));
    //Events.on('localWillLeaveMatch', this.goToLobbyScene.bind(this));
  }

  public goToMatchScene() {
    //console.log('OBS switched to match scene');
  }

  public goToLobbyScene() {
    //console.log('OBS switched to lobby scene');
  }
}
