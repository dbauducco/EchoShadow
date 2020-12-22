import { IEchoDataSnapshot } from './IEchoDataSnapshot';

export interface IEchoDataRepository {
  getSnapshot(): Promise<IEchoDataSnapshot | undefined>;
  getFullSnapshot(): Promise<any | undefined>;
}
