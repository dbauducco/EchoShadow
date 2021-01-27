export interface IEchoMatchPlayerData {
  name: string;
  head?: {
    position: number[];
    forward: number[];
    left: number[];
    up: number[];
  };
  body?: {
    position: number[];
    forward: number[];
    left: number[];
    up: number[];
  };
  left_hand?: {
    position: number[];
    forward: number[];
    left: number[];
    up: number[];
  };
  right_hand?: {
    position: number[];
    forward: number[];
    left: number[];
    up: number[];
  };
}
