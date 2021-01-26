import EchoVRClient from './src/clients/EchoVRClient';

const client = new EchoVRClient(
  'C:\\Program Files\\Oculus\\Software\\Software\\ready-at-dawn-echo-arena\\bin\\win7\\echovr.exe'
);

client.open();
