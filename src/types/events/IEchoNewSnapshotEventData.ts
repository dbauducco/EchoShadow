import { IEchoDataSnapshot } from '../IEchoDataSnapshot';

export interface IEchoNewSnapshotEventData {
  remoteSnapshot: IEchoDataSnapshot | undefined;
  localSnapshot: IEchoDataSnapshot | undefined;
}
