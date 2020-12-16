import React from 'react';
import ComputerLogo from '../../assets/computer.svg';
import HeadsetLogo from '../../assets/headset.svg';
import { DeviceStatusEnum, DeviceTypeEnum } from '../../types';
import { DeviceStatusContainer, DeviceStatusIP } from './styles';

type DeviceStatusProps = {
  status: DeviceStatusEnum;
  deviceType: DeviceTypeEnum;
  ipAddress: string;
};

const DeviceStatus: React.FC<DeviceStatusProps> = ({
  status,
  deviceType,
  ipAddress,
}: DeviceStatusProps) => {
  let logoColor = 'grey';
  if (status === DeviceStatusEnum.Nominal) {
    logoColor = '#5DBB63';
  } else if (status === DeviceStatusEnum.Warning) {
    logoColor = '#F5D752';
  } else if (status === DeviceStatusEnum.Error) {
    logoColor = '#FF7961';
  } else if (status === DeviceStatusEnum.Inactive) {
    logoColor = '#4a4461';
  }

  return (
    <DeviceStatusContainer>
      {deviceType === DeviceTypeEnum.Computer && (
        <ComputerLogo height={80} width={80} fill={logoColor} />
      )}
      {deviceType === DeviceTypeEnum.Headset && (
        <HeadsetLogo height={80} width={80} fill={logoColor} />
      )}
      <DeviceStatusIP>{ipAddress}</DeviceStatusIP>
    </DeviceStatusContainer>
  );
};

export default DeviceStatus;
