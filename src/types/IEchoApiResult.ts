import { EchoGameStatus } from './enums';

export interface IEchoApiResult {
  disc: {
    position: [number, number, number];
    forward: [number, number, number];
    left: [number, number, number];
    up: [number, number, number];
    velocity: [number, number, number];
    bounce_count: number;
  };
  sessionid: string;
  orange_team_restart_request: number;
  sessionip: string;
  game_status: EchoGameStatus;
  game_clock_display: string;
  game_clock: number;
  match_type: string;
  map_name: string;
  private_match: true;
  orange_points: 2;
  player: {
    vr_left: [number, number, number];
    vr_position: [number, number, number];
    vr_forward: [number, number, number];
    vr_up: [number, number, number];
  };
  pause: {
    paused_state: string;
    unpaused_team: string;
    paused_requested_team: string;
    unpaused_timer: number;
    paused_timer: number;
  };
  possession: [number, number];
  tournament_match: boolean;
  blue_team_restart_request: number;
  client_name: string;
  blue_points: number;
  last_score: {
    disc_speed: number;
    team: string;
    goal_type: string;
    point_amount: 2 | 3;
    distance_thrown: number;
    person_scored: string;
    assist_scored: string;
  };
  teams: [IEchoApiResultTeam, IEchoApiResultTeam, IEchoApiResultTeam];
}

export interface IEchoApiResultPlayer {
  rhand: {
    pos: [number, number, number];
    forward: [number, number, number];
    left: [number, number, number];
    up: [number, number, number];
  };
  playerid: number;
  name: string;
  userid: number;
  stats: {
    possession_time: number;
    points: number;
    saves: number;
    goals: number;
    stuns: number;
    passes: number;
    catches: number;
    steals: number;
    blocks: number;
    interceptions: number;
    assists: number;
    shots_taken: number;
  };
  number: number;
  level: number;
  stunned: boolean;
  ping: number;
  invulnerable: boolean;
  head: {
    position: [number, number, number];
    forward: [number, number, number];
    left: [number, number, number];
    up: [number, number, number];
  };
  possession: boolean;
  body: {
    position: [number, number, number];
    forward: [number, number, number];
    left: [number, number, number];
    up: [number, number, number];
  };
  lhand: {
    pos: [number, number, number];
    forward: [number, number, number];
    left: [number, number, number];
    up: [number, number, number];
  };
  blocking: boolean;
  velocity: [number, number, number];
}

export interface IEchoApiResultTeam {
  players?: IEchoApiResultPlayer[];
  team: string;
  possession: boolean;
  stats: {
    possession_time: number;
    points: number;
    goals: number;
    saves: number;
    stuns: number;
    interceptions: number;
    blocks: number;
    passes: number;
    catches: number;
    steals: number;
    assists: number;
    shots_taken: number;
  };
}
