import { IEchoMatchData, IEchoCameraController } from '../types';

export default class DoNothingCameraController
  implements IEchoCameraController {
  update(matchData: IEchoMatchData) {}

  getDefault(matchData: IEchoMatchData) {}
}
