import * as path from 'path';
import { exec } from './utils';
import { log } from './log';

const findAllDrives = async () => {
  const result = await exec('wmic logicaldisk get name');
  const filtered = result.stdout
    .split('\r\r\n')
    .filter(value => /[A-Za-z]:/.test(value))
    .map(value => value.trim());
  return filtered;
};

const optimizeDriveSearch = (drives: string[]) => {
  const indexOfC = drives.indexOf('C:');
  if (indexOfC > -1) {
    drives.splice(indexOfC, 1);
    drives.push('"C:\\Program Files"');
    drives.push('C:');
  }
  return drives;
};

const locateInDrive = async (drive: string, file: string) => {
  try {
    const result = await exec(`where /R ${drive}\\ ${file}`);
    return result.stdout.split('\r\n');
  } catch (error) {
    return undefined;
  }
};

const locate = async () => {
  const rawDrives: string[] = await findAllDrives();
  const drives: string[] = optimizeDriveSearch(rawDrives);
  log.verbose({ message: 'EchoVRLocator.locate', drives });
  for (const index in drives) {
    const searchResults = await locateInDrive(drives[index], 'echovr.exe');
    if (searchResults && searchResults.length > 0) {
      log.verbose(`Found in ${drives[index]}`);
      return path.join(searchResults[0], '');
    }
  }
  return undefined;
};

export default { locate };
