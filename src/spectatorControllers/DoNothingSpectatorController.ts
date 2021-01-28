import { IEchoMatchData, IEchoSpectatorController } from '../types';

export default class DoNothingSpectatorController
  implements IEchoSpectatorController {
  update(matchData: IEchoMatchData) {}
}
