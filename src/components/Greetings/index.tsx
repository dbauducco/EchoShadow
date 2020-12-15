import React from 'react';
import { Container, Text } from './styles';

const Greetings: React.FC = () => {
  return (
    <Container>
      <Text>
        EchoShadow is running
        <span role="img" aria-label="running">
          🏃
        </span>
      </Text>
    </Container>
  );
};

export default Greetings;
