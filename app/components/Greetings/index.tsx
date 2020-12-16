import React from 'react';
import { Container, Text, HorizontalContainer } from './styles';
import { ipcRenderer } from 'electron';
import DeviceStatus from '../DeviceStatus';

type GreetingState = {
  statusMessage: any;
  localStatus: any;
  remoteStatus: any;
};

class Greetings extends React.Component<{}, GreetingState> {
  // Constructor for the greetings class
  constructor(props: any) {
    super(props);

    this.state = {
      statusMessage: 'Default message',
      localStatus: 'Unknown',
      remoteStatus: 'Unknown',
    };

    ipcRenderer.on('shadowStatusUpdate', this.receiveData.bind(this));
  }

  receiveData(event: Electron.IpcRendererEvent, args: any) {
    this.setState({
      statusMessage: args.statusMessage,
      localStatus: args.localStatus,
      remoteStatus: args.remoteStatus,
    });
  }

  render() {
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
        <Text>{this.state?.statusMessage}</Text>
      </Container>
    );
  }
}

export default Greetings;
