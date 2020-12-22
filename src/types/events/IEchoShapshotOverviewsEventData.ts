import { IEchoDataSnapshot } from '../IEchoDataSnapshot';

export interface IEchoSnapshotOverviewsEventData {
  oldRemoteSnapshot: IEchoDataSnapshot | undefined;
  newRemoteSnapshot: IEchoDataSnapshot | undefined;
  oldLocalSnapshot: IEchoDataSnapshot | undefined;
  newLocalSnapshot: IEchoDataSnapshot | undefined;
}
