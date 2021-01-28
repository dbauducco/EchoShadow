import DoNothingSpectatorController from '../spectatorControllers/DoNothingSpectatorController';
import FollowSpectatorController from '../spectatorControllers/FollowSpectatorController';
import POVSpectatorController from '../spectatorControllers/POVSpectatorController';
import SidelineSpectatorController from '../spectatorControllers/SidelineSpectatorController';
import EchoVRClient from '../clients/EchoVRClient';
import {
  EventType,
  IConfigInfo,
  IEchoMatchData,
  IEchoSpectatorController,
} from '../types';
import { log, Events } from '../utilities';
import { ListenSpectatorController } from '../spectatorControllers/ListenSpectatorController';

export default class SpectatorManager {
  spectatorController?: IEchoSpectatorController;

  listenSpectatingController: ListenSpectatorController;

  constructor(
    private configData: IConfigInfo,
    private echoVrClient: EchoVRClient
  ) {
    Events.on(
      EventType.LocalJoinedMatch,
      this.setDefaultSpectatorOption.bind(this)
    );
    Events.on(EventType.RemoteChangedTeam, this.handleTeamChanged.bind(this));
    Events.on(EventType.NewMatchData, this.updateController.bind(this));
    Events.on(
      EventType.NewSpectatorTarget,
      this.setNewSpectatorTarget.bind(this)
    );
    this.listenSpectatingController = new ListenSpectatorController(
      this.echoVrClient
    );
  }

  private async setDefaultSpectatorOption(matchData: IEchoMatchData) {
    if (this.configData.spectatorOptions.hideUI) {
      this.echoVrClient.requestUIToggle();
    }

    switch (this.configData.spectatorOptions.mode) {
      case 'follow':
        this.spectatorController = new FollowSpectatorController(
          this.echoVrClient,
          matchData.remote.name
        );
        break;
      case 'pov':
        this.spectatorController = new POVSpectatorController(
          this.echoVrClient,
          matchData.remote.name
        );
        break;
      case 'sideline':
        this.spectatorController = new SidelineSpectatorController(
          this.echoVrClient
        );
        break;
      case 'default':
        this.spectatorController = new DoNothingSpectatorController();
        break;
      default:
        this.spectatorController = new DoNothingSpectatorController();
        break;
    }

    await this.listenSpectatingController.handleMutingBasedOnTeam(
      this.configData.spectatorOptions.listenOptions,
      matchData
    );
  }

  /**
   * Method that recieves the updates on game data and passes it on
   * to the cameraControllers
   */
  private async updateController(matchData: IEchoMatchData) {
    // Check that matchData exists and is not null
    if (!matchData || !matchData.local.inMatch) {
      return;
    }

    // Check that a spectator controller exists
    if (!this.spectatorController) {
      return;
    }

    this.spectatorController.update(matchData);
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
    log.info(`Requested new spectator target: ${targetName}`);
    if (targetType === 'FOLLOW') {
      this.spectatorController = new FollowSpectatorController(
        this.echoVrClient,
        targetPlayer
      );
    } else if (targetType === 'POV') {
      this.spectatorController = new POVSpectatorController(
        this.echoVrClient,
        targetPlayer
      );
    }
  }

  public async handleTeamChanged(matchData: IEchoMatchData) {
    const listeningResult = await this.listenSpectatingController.handleMutingBasedOnTeam(
      this.configData.spectatorOptions.listenOptions,
      matchData
    );
    log.info({ message: 'handleTeamChanged', listeningResult });
  }
}
