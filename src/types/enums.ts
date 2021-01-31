export enum EchoGameStatus {
  PreMatch = 'pre_match',
  RoundStart = 'round_start',
  Playing = 'playing',
  Paused = 'paused',
  Score = 'score',
  RoundOver = 'round_over',
  SuddenDeath = 'sudden_death',
  PostMatch = 'post_match',
  Unknown = 'unknown',
  Undefined = '',
}

export enum EchoSessionType {
  Arena_Match = 'Arena_Match',
  Private_Arena_Match = 'Private_Arena_Match',
  Lobby = 'Lobby',
  Unknown = 'Unknown',
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

export enum ShadowStateType {
  WaitingForRemoteData = 'Waiting for Player Data...',
  WaitingForRemoteMatch = 'Waiting for Player to join Match...',
  JoiningRemote = 'Joining Match...',
  SyncedWithRemote = 'Synced',
  StartingUp = 'Starting up EchoShadow...',
  InvalidEchoPath = 'Error in Echo Path',
  EchoIsNotInstalled = 'EchoVR Installation Not Detected',
  RunningRedirect = 'Running API Redirect...',
}
