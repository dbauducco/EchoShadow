import { IEchoMatchData } from './';
import * as robotjs from 'robotjs';

export interface IEchoCameraController {
  update(matchData: IEchoMatchData, keyboard: typeof robotjs): void;
  getDefault(matchData: IEchoMatchData, keyboard: typeof robotjs): void;
}
