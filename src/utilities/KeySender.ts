import { exec } from './utils';

/**
 * A public method to instruct winSK to send certain keys with configurable options
 * @param keyString The string of keys to send
 * @param windowTitle The title of the process to send the keys to
 * @param initialDelay The amount of time (in ms) between window focus and first character being pressed
 * @param characterDelay The amount of time (in ms) between characters
 * @param holdTime The amount of time (in ms) that the character should be held down
 */
const sendKey = async (
  keyString: string,
  windowTitle: string,
  initialDelay: number = 100,
  characterDelay: number = 6,
  holdTime: number = 6
) => {
  // Define the relative path location
  const winSKPath = '.\\resources\\winSK.exe';
  // Create an array to hold all the components of the command
  const commandBuilder = [];
  // Add the components one at a time
  commandBuilder.push(winSKPath);
  // Uncomment the following line to enable logging:
  // commandBuilder.push('-d');
  commandBuilder.push('-w "' + windowTitle + '"');
  commandBuilder.push('-i ' + initialDelay);
  commandBuilder.push('-s ' + characterDelay);
  commandBuilder.push('-sd ' + holdTime);
  commandBuilder.push(keyString);
  // Create a final string from the components seperated with ' '
  const commandString = commandBuilder.join(' ');
  // Execute the command
  return exec(commandString);
};

export default sendKey;
