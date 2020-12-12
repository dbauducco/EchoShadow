import { EchoSessionType } from './EchoSessionType';

export interface IEchoDataSnapshot {
  sessionId: string;
  sessionType: EchoSessionType;
  clientName: string;
  clientIndexId: number;
}
