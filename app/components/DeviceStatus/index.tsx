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
}: DeviceStatusProps) => {
  let logoColor = 'grey';
  if (status === 'nominal') {
    logoColor = '#5DBB63';
  } else if (status == 'warning') {
    logoColor = '#F5D752';
  } else if (status == 'error') {
    logoColor = '#FF7961';
  } else if (status == 'inactive') {
    logoColor = '#4a4461';
  }

  return (
    <DeviceStatusContainer>
      {deviceType === 'computer' && (
        <ComputerLogo height={80} width={80} fill={logoColor} />
      )}
      {deviceType === 'headset' && (
        <HeadsetLogo height={80} width={80} fill={logoColor} />
      )}
      <DeviceStatusIP>{ipAddress}</DeviceStatusIP>
    </DeviceStatusContainer>
  );
};

export default DeviceStatus;
