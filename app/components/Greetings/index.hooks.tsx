import React from 'react';
import { Container, Text, HorizontalContainer } from './styles';
import { ipcRenderer } from 'electron';
import DeviceStatus from '../DeviceStatus';

type GreetingState = {
  statusMessage: any;
  localStatus: any;
  remoteStatus: any;
};

const Greetings: React.FC<GreetingState> = (props: any) => {
  const [statusMessage, setStatusMessage] = React.useState('Default message');
  const [localStatus, setLocalStatus] = React.useState('Unknown');
  const [remoteStatus, setRemoteStatus] = React.useState('Unknown');

  React.useEffect(() => {
    ipcRenderer.on(
      'shadowStatusUpdate',
      (event: Electron.IpcRendererEvent, args: any) => {
        setStatusMessage(args.statusMessage);
        setLocalStatus(args.localStatus);
        setRemoteStatus(args.remoteStatus);
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
          ipAddress="192.168.1.1"
          status="nominal"
        ></DeviceStatus>
        <DeviceStatus
          deviceType="computer"
          ipAddress="192.168.1.1"
          status="nominal"
        ></DeviceStatus>
      </HorizontalContainer>
      <Text>{statusMessage}</Text>
      <p>Local Status Test: {localStatus}</p>
      <p>Remote Status Test: {remoteStatus}</p>
    </Container>
  );
};

export default Greetings;
