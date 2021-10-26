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
import DiscSpectatorController from '../spectatorControllers/DiscSpectatorController';

export default class SpectatorManager {
  spectatorController?: IEchoSpectatorController;

  listenSpectatingController: ListenSpectatorController;

  wentIntoAPIMode = false;

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
    Events.on(EventType.RoundOver, this.handleRoundOver.bind(this));
    Events.on(EventType.MatchOver, this.handleMatchOver.bind(this));
    this.listenSpectatingController = new ListenSpectatorController(
      this.echoVrClient
    );
    Events.on(EventType.SuddenDeath, this.handleSuddenDeath.bind(this));
    this.listenSpectatingController = new ListenSpectatorController(
      this.echoVrClient
    );
  }

  private async setDefaultSpectatorOption(matchData: IEchoMatchData) {
    log.verbose({
      message: 'setDefaultSpectatorOption',
      mode: this.configData.spectatorOptions.mode,
    });
    this.echoVrClient.setUIVisibility(!this.configData.spectatorOptions.hideUI);
    // if (this.configData.spectatorOptions.hideUI) {
    //   this.echoVrClient.requestUIToggle();
    // }

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
      case 'disc':
        this.spectatorController = new DiscSpectatorController(
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

    if (this.spectatorController != null) {
      this.spectatorController.getDefault(matchData);
    }

    const listeningResult = await this.listenSpectatingController.handleMutingBasedOnTeam(
      this.configData.spectatorOptions.listenOptions,
      matchData
    );
    log.info({ message: 'initial listening status', listeningResult });
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

    if (this.wentIntoAPIMode == false) {
      this.echoVrClient.requestAPIMode();
      this.wentIntoAPIMode = true;
      return;
    }

    await this.spectatorController.update(matchData);
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

  public async handleRoundOver() {
    if (this.configData.spectatorOptions.showScoresBetweenRounds) {
      await this.echoVrClient.showScoreBoard(
        this.configData.spectatorOptions.secondsToShowScoreBetweenRounds
      );
    }
    log.info({ message: 'handleRoundOver' });
  }

  public async handleMatchOver() {
    if (this.configData.spectatorOptions.showScoresBetweenRounds) {
      await this.echoVrClient.showScoreBoard(
        this.configData.spectatorOptions.secondsToShowScoreBetweenRounds
      );
    }
    log.info({ message: 'handleMatchOver' });
  }

  public async handleSuddenDeath() {
    if (this.configData.spectatorOptions.showScoresBetweenRounds) {
      await this.echoVrClient.showScoreBoard(
        this.configData.spectatorOptions.secondsToShowScoreBetweenRounds
      );
    }
    log.info({ message: 'handleSuddenDeath' });
  }
}
