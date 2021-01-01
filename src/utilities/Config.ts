import * as os from 'os';
import * as fse from 'fs-extra';
import * as path from 'path';
import { ipcMain } from 'electron';
import { config } from 'winston';
import { IConfigInfo, LogLevel } from '../types';
import { log, initLogger } from './log';
import { exec } from './utils';
import EchoVRLocator from './EchoVRLocator';

export class Config {
  // Creating the path to the config file
  private CONFIG_PATH = path.join(
    os.homedir(),
    'AppData/Local/EchoShadow/config.json'
  );
  // Defaults:
  private DEFAULT_LOG_LEVEL: LogLevel = LogLevel.INFO;
  private DEFAULT_PC_ECHO_IP_ADDRESS = '127.0.0.1';
  // Storing options
  public options?: IConfigInfo;

  constructor(
    private overrideEchoPath?: string,
    private overrideRemoteApiIpAddress?: string,
    private overrideLocalApiIpAddress?: string,
    private overrideLogLevel?: LogLevel,
    private overrideDebugUI?: boolean
  ) {
    ipcMain.on('open-config', this.openConfigFile.bind(this));
  }

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
    initLogger(this.options?.logLevel);
  }

  private async writeDefaultConfig() {
    try {
      // Create the default data
      const configData: IConfigInfo = {
        echoPath: this.overrideEchoPath || '',
        remoteApiIpAddress:
          this.overrideRemoteApiIpAddress || this.DEFAULT_PC_ECHO_IP_ADDRESS,
        localApiIpAddress:
          this.overrideLocalApiIpAddress || this.DEFAULT_PC_ECHO_IP_ADDRESS,
        logLevel: this.overrideLogLevel || this.DEFAULT_LOG_LEVEL,
        debugUI: this.overrideDebugUI || false,
        hideUIOnJoin: false,
        spectateCameraOption: 'none',
      };
      // Automatically determine the Echo path
      const detectedEchoPath = await EchoVRLocator.locate();
      if (detectedEchoPath) {
        configData.echoPath = detectedEchoPath;
      }
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
      const overridenConfigData: IConfigInfo = {
        echoPath: this.overrideEchoPath || configData.echoPath,
        remoteApiIpAddress:
          this.overrideRemoteApiIpAddress || configData.remoteApiIpAddress,
        localApiIpAddress:
          this.overrideLocalApiIpAddress || configData.localApiIpAddress,
        logLevel:
          this.overrideLogLevel ||
          (configData.logLevel.toLowerCase() as LogLevel),
        debugUI: this.overrideDebugUI || !!configData.debugUI,
        hideUIOnJoin: configData.hideUIOnJoin,
        spectateCameraOption: configData.spectateCameraOption,
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

  public openConfigFile() {
    exec('start ' + this.CONFIG_PATH);
  }
}
