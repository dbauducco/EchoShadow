import React from 'react';
import { ipcRenderer } from 'electron';
import { ImpulseSpinner, SwapSpinner } from 'react-spinners-kit';
import { Container, Text, HorizontalContainer } from './styles';
import DeviceStatus from '../DeviceStatus';
import packageJson from '../../../package.json';

const Greetings: React.FC = () => {
  return (
    <Container>
      <HorizontalContainer></HorizontalContainer>
      <Text>Shadow is running.</Text>
    </Container>
  );
};

export default Greetings;
