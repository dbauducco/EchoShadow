import React from 'react';
import { Container, Text, HorizontalContainer } from './styles';
import { ipcRenderer } from 'electron';
import DeviceStatus from '../DeviceStatus';

type GreetingState = {
  statusMessage: any;
  localStatus: any;
  remoteStatus: any;
  localIp: any;
  remoteIp: any;
};

class Greetings extends React.Component<{}, GreetingState> {
  // Constructor for the greetings class
  constructor(props: any) {
    super(props);

    this.state = {
      statusMessage: 'Default message',
      localStatus: 'Unknown',
      remoteStatus: 'Unknown',
      localIp: 'Unknown',
      remoteIp: 'Unknown',
    };

    ipcRenderer.on('shadowStatusUpdate', this.receiveData.bind(this));
  }

  receiveData(event: Electron.IpcRendererEvent, args: any) {
    this.setState({
      statusMessage: args.statusMessage,
      localStatus: args.localStatus,
      remoteStatus: args.remoteStatus,
      localIp: args.localIp,
      remoteIp: args.remoteIp,
    });
  }

  render() {
    return (
      <Container>
        <HorizontalContainer>
          <DeviceStatus
            deviceType="headset"
            ipAddress={this.state?.remoteIp}
            status={this.state?.remoteStatus}
          ></DeviceStatus>
          <DeviceStatus
            deviceType="computer"
            ipAddress={this.state?.localIp}
            status={this.state?.localStatus}
          ></DeviceStatus>
        </HorizontalContainer>
        <Text>{this.state?.statusMessage}</Text>
      </Container>
    );
  }
}

export default Greetings;
