import { IEchoDataSnapshot } from './IEchoDataSnapshot';

export interface IEchoDataRepository {
  getSnapshot(): Promise<IEchoDataSnapshot | undefined>;
  getInstantSnapshot(): Promise<IEchoDataSnapshot | undefined>;
  getInstantRawSnapshot(): Promise<IEchoDataSnapshot | undefined>;
  enableRetries(): void;
  disableRetries(): void;
}
