import { exec as execNative, spawn } from 'child_process';
import { promisify } from 'util';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

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

const killProcess = async (
  processId?: number | string,
  force?: boolean,
  processName?: string
) => {
  // /t will also kill any process started by the EchoVR process. Known as tree killing.
  const forceFlag = force ? ' /F' : '';

  if (processId) {
    await exec(`taskkill /pid ${processId} /T${forceFlag}`);
  } else {
    await exec(`taskkill /IM ${processName} /T${forceFlag}`);
  }
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export { exec, getProcessId, killProcess, sleep, spawn, delay };
