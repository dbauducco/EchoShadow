import React from 'react';
import ComputerLogo from '../../assets/computer.svg';
import HeadsetLogo from '../../assets/headset.svg';
import { DeviceStatusContainer, DeviceStatusIP } from './styles';

type DeviceStatusProps = {
  status: 'nominal' | 'warning' | 'error' | 'inactive';
  deviceType: 'headset' | 'computer';
  ipAddress: string;
};

const DeviceStatus: React.FC<DeviceStatusProps> = ({
  status,
  deviceType,
  ipAddress,
}) => {
  let logoColor = 'grey';
  if (status == 'nominal') {
    logoColor = '#5DBB63';
  }

  return (
    <DeviceStatusContainer>
      {deviceType === 'computer' && (
        <ComputerLogo height={80} width={80} fill={logoColor}></ComputerLogo>
      )}
      {deviceType === 'headset' && (
        <HeadsetLogo height={80} width={80} fill={logoColor}></HeadsetLogo>
      )}
      <DeviceStatusIP>{ipAddress}</DeviceStatusIP>
    </DeviceStatusContainer>
  );
};

export default DeviceStatus;

/*
Okay, gonna add it rn

https://www.npmjs.com/package/react-svg-loader --> 157,000+ downloads per week

*/
