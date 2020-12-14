import { exec as execNative } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execNative);

const getProcessId = async (
  processName: string
): Promise<string | undefined> => {
  const activeProcessResult = await exec('tasklist');
  const activeProcesses = activeProcessResult?.stdout?.split('\r\n') || [];
  const echoProcessLine = activeProcesses.find(process =>
    process.includes(processName)
  );
  if (!echoProcessLine) {
    return undefined;
  }
  const echoPid = echoProcessLine.replace(processName, '').trim().split(' ')[0];
  return echoPid;
};

const killProcess = async (processId: string) => {
  // /t will also kill any process started by the EchoVR process. Known as tree killing.
  await exec(`taskkill /pid ${processId} /t`);
};

export { exec, getProcessId, killProcess };
