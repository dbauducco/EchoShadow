import React from 'react';
import { ipcRenderer } from 'electron';
import { ImpulseSpinner, SwapSpinner } from 'react-spinners-kit';
import { Container, Text, HorizontalContainer } from './styles';
import DeviceStatus from '../DeviceStatus';
import { DeviceStatusEnum, DeviceTypeEnum } from '../../types';

const Greetings: React.FC = () => {
  const [statusMessage, setStatusMessage] = React.useState(
    'Starting up EchoShadow v1.3.0...'
  );
  const [localStatus, setLocalStatus] = React.useState<DeviceStatusEnum>(
    DeviceStatusEnum.Inactive
  );
  const [remoteStatus, setRemoteStatus] = React.useState<DeviceStatusEnum>(
    DeviceStatusEnum.Inactive
  );
  const [localIp, setLocalIp] = React.useState('Loading');
  const [remoteIp, setRemoteIp] = React.useState('Loading');

  React.useEffect(() => {
    // ipcRenderer.on(
    //   'shadowStatusUpdate',
    //   (event: Electron.IpcRendererEvent, args: any) => {
    //     console.log(args);
    //     setStatusMessage(args.statusMessage);
    //     setLocalStatus(args.localStatus);
    //     setRemoteStatus(args.remoteStatus);
    //     setLocalIp(args.localIp);
    //     setRemoteIp(args.remoteIp);
    //   }
    // );
    setInterval(() => {
      ipcRenderer.invoke('shadowStatusUpdate').then(result => {
        setStatusMessage(result.statusMessage);
        setLocalStatus(result.localStatus);
        setRemoteStatus(result.remoteStatus);
        setLocalIp(result.localIp);
        setRemoteIp(result.remoteIp);
      });
    }, 2000);
    return function cleanup() {
      // we might or might not need this, I just saw it in a stack overflow
      ipcRenderer.removeAllListeners('shadowStatusUpdate');
    };
  }, []);

  return (
    <Container>
      <HorizontalContainer>
        <DeviceStatus
          deviceType={DeviceTypeEnum.Headset}
          ipAddress={remoteIp}
          status={remoteStatus}
        />
        {statusMessage !== 'Synced' && (
          <ImpulseSpinner loading frontColor="#655d80" backColor="#282436" />
        )}
        {statusMessage === 'Synced' && <SwapSpinner loading color="#5DBB63" />}
        <DeviceStatus
          deviceType={DeviceTypeEnum.Computer}
          ipAddress={localIp}
          status={localStatus}
        />
      </HorizontalContainer>
      <Text>{statusMessage}</Text>
    </Container>
  );
};

export default Greetings;
