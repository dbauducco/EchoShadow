import { IEchoDataSnapshot } from '../IEchoDataSnapshot';

export interface IEchoMatchChangedEventData {
  oldRemoteSnapshot: IEchoDataSnapshot | undefined;
  newRemoteSnapshot: IEchoDataSnapshot | undefined;
  oldLocalSnapshot: IEchoDataSnapshot | undefined;
  newLocalSnapshot: IEchoDataSnapshot | undefined;
}
