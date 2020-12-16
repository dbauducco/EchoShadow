import React from 'react';
import { ipcRenderer } from 'electron';
import { Container, Text, HorizontalContainer } from './styles';
import DeviceStatus from '../DeviceStatus';

type GreetingState = {
  statusMessage: any;
  localStatus: any;
  remoteStatus: any;
  localIp: any;
  remoteIp: any;
};
const Greetings: React.FC<GreetingState> = () => {
  const [statusMessage, setStatusMessage] = React.useState('Default message');
  const [localStatus, setLocalStatus] = React.useState('Unknown');
  const [remoteStatus, setRemoteStatus] = React.useState('Unknown');
  const [localIp, setLocalIp] = React.useState('Unknown');
  const [remoteIp, setRemoteIp] = React.useState('Unknown');

  React.useEffect(() => {
    ipcRenderer.on(
      'shadowStatusUpdate',
      (event: Electron.IpcRendererEvent, args: any) => {
        setStatusMessage(args.statusMessage);
        setLocalStatus(args.localStatus);
        setRemoteStatus(args.remoteStatus);
        setLocalIp(args.localIp);
        setRemoteIp(args.remoteIp);
      }
    );
    return function cleanup() {
      // we might or might not need this, I just saw it in a stack overflow
      ipcRenderer.removeAllListeners('shadowStatusUpdate');
    };
  }, []);

  return (
    <Container>
      <HorizontalContainer>
        <DeviceStatus
          deviceType="headset"
          ipAddress={remoteIp}
          status={remoteStatus}
        />
        <DeviceStatus
          deviceType="computer"
          ipAddress={localIp}
          status={localStatus}
        />
      </HorizontalContainer>
      <Text>{statusMessage}</Text>
    </Container>
  );
};

export default Greetings;
