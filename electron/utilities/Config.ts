import * as os from 'os';
import * as fse from 'fs-extra';
import { IConfigInfo } from '../types';
import { log } from '../utilities/log';
const path = require('path');

export default class Config {
  private DEFAULT_ECHO_PATH = path.join(
    'C:/Program Files/Oculus/Software/Software/ready-at-dawn-echo-arena/bin/win7/echovr.exe',
    ''
  );
  private DEFAULT_PC_ECHO_IP_ADDRESS = '127.0.0.1';
  private CONFIG_PATH = path.join(
    os.homedir(),
    'AppData/Local/EchoShadow/config.json'
  );

  public options?: IConfigInfo;

  constructor(
    private overrideEchoPath?: string,
    private overrideRemoteApiIpAddress?: string,
    private overrideLocalApiIpAddress?: string,
    private overrideUseLogFile?: boolean
  ) {}

  /**
   * initializes the Config options. This must be called in order to use the config class
   */
  async init() {
    // First attempt to read the options from the file
    this.options = await this.readConfig();
    // If options is still null, this is because the file didn't exist
    if (!this.options) {
      this.options = await this.writeDefaultConfig();
    }
  }

  private async writeDefaultConfig() {
    try {
      // Create the default data
      const configData: IConfigInfo = {
        echoPath: this.overrideEchoPath || this.DEFAULT_ECHO_PATH,
        remoteApiIpAddress:
          this.overrideRemoteApiIpAddress || this.DEFAULT_PC_ECHO_IP_ADDRESS,
        localApiIpAddress:
          this.overrideLocalApiIpAddress || this.DEFAULT_PC_ECHO_IP_ADDRESS,
        useLogFile: this.overrideUseLogFile || false,
      };
      // Write the output file
      await fse.outputFile(
        this.CONFIG_PATH,
        JSON.stringify(configData, null, 4)
      );
      // Set the current options to the default data
      return configData;
    } catch (error) {
      log.error({
        message: 'Error creating config.',
        error: error.message ? error.message : error,
      });
      return undefined;
    }
  }

  private async readConfig() {
    try {
      // Create the data buffer
      const dataBuffer = fse.readFileSync(this.CONFIG_PATH);
      if (!dataBuffer) {
        // File doesn't exist
        return undefined;
      }
      // Read the file
      const configData: IConfigInfo = JSON.parse(dataBuffer.toString());
      // Apply the overrides
      const overridenConfigData = {
        echoPath: this.overrideEchoPath || configData.echoPath,
        remoteApiIpAddress:
          this.overrideRemoteApiIpAddress || configData.remoteApiIpAddress,
        localApiIpAddress:
          this.overrideLocalApiIpAddress || configData.localApiIpAddress,
        useLogFile: this.overrideUseLogFile || configData.useLogFile,
      };
      return overridenConfigData;
    } catch (error) {
      log.error({
        message: 'Error reading config.',
        error: error.message ? error.message : error,
      });
      return undefined;
    }
  }
}
