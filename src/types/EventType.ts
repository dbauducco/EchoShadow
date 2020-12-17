export enum EventType {
  RemoteJoinedMatch = 'remoteJoinedMatch',
  RemoteLeftMatch = 'remoteLeftMatch',
  LocalJoinedMatch = 'localJoinedMatch',
  LocalLeftMatch = 'localLeftMatch',
  LocalWillLeaveMatch = 'localWillLeaveMatch',
  LocalWillJoinMatch = 'localWillJoinMatch',
  LocalSnapshotChanged = 'localSnapshotChanged',
  RemoteSnapshotChanged = 'remoteSnapshotChanged',
}
