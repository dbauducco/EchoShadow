import { exec } from './utils';
import * as path from 'path';

const locate = async () => {
  const drives: string[] = await findAllDrives();
  for (const index in drives) {
    const searchResults = await locateInDrive(drives[index], 'echovr.exe');
    if (searchResults && searchResults.length > 0) {
      return path.join(searchResults[0], '');
    }
  }
  return undefined;
};

const findAllDrives = async () => {
  const result = await exec('wmic logicaldisk get name');
  const filtered = result.stdout
    .split('\r\r\n')
    .filter(value => /[A-Za-z]:/.test(value))
    .map(value => value.trim());
  return filtered;
};

const locateInDrive = async (drive: string, file: string) => {
  try {
    const result = await exec('where /R ' + drive + '\\ ' + file);
    return result.stdout.split('\r\n');
  } catch (error) {
    return undefined;
  }
};

export default { locate };
