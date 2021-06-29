import { IEchoMatchData, IEchoSpectatorController } from '../types';

export default class DoNothingSpectatorController
  implements IEchoSpectatorController {
  // Default
  async getDefault(matchData: IEchoMatchData) {
    return undefined;
  }
  update(matchData: IEchoMatchData) {}
}
