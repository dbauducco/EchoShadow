import * as os from 'os';
import * as fse from 'fs-extra';
import * as path from 'path';
// import { ipcMain } from 'electron';
import { merge } from 'lodash';
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
  private DEFAULT_CONFIG: IConfigInfo = {
    configVersion: 'v2',
    echoPath: '',
    network: {
      questIP: '127.0.0.1',
      questPort: '6721',
      localIP: '127.0.0.1',
      localPort: '6721',
    },
    spectatorOptions: {
      hideUI: false,
      mode: 'default',
      listenOptions: 'same',
    },
    redirectAPI: {
      enabled: false,
      serverPort: '1010',
    },
    dev: {
      logLevel: LogLevel.INFO,
      debugUI: false,
    },
  };

  // Storing options
  public options?: IConfigInfo;

  // constructor() {
  // ipcMain.on('open-config', this.openConfigFile.bind(this));
  // }

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
    initLogger(this.options?.dev.logLevel);
  }

  /**
   * Method to write the config file out to appdata.
   */
  private async writeDefaultConfig() {
    try {
      // Create the default data
      const configData: IConfigInfo = this.DEFAULT_CONFIG;
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

  private mergeConfigsAndClean(dirtyConfigData: IConfigInfo): IConfigInfo {
    const cleanedConfigData = {
      ...dirtyConfigData,
      spectatorOptions: {
        ...dirtyConfigData.spectatorOptions,
        mode: dirtyConfigData.spectatorOptions?.mode?.toLowerCase() as 'follow',
        listenOptions: dirtyConfigData.spectatorOptions?.listenOptions?.toLowerCase() as 'same',
      },
      dev: {
        ...dirtyConfigData.dev,
        logLevel: dirtyConfigData?.dev?.logLevel?.toLowerCase() as LogLevel.INFO,
      },
    };
    const mergedConfig = merge(this.DEFAULT_CONFIG, cleanedConfigData);
    return mergedConfig;
  }

  /**
   * Method to read the config file from appdata.
   */
  public async readConfig() {
    try {
      // Create the data buffer
      const dataBuffer = fse.readFileSync(this.CONFIG_PATH);
      if (!dataBuffer) {
        // File doesn't exist
        return undefined;
      }
      // Read the file
      const dirtyConfigData: IConfigInfo = JSON.parse(dataBuffer.toString());

      // Check config format version
      if (dirtyConfigData.configVersion === 'v2') {
        const cleanConfigData = this.mergeConfigsAndClean(dirtyConfigData);
        await fse.outputFile(
          this.CONFIG_PATH,
          JSON.stringify(cleanConfigData, null, 4)
        );
        return cleanConfigData;
      }
      // We need to upgrade the config format
      const newDirtyFormatData = this.upgradeConfig(dirtyConfigData);
      const newCleanFormatData = this.mergeConfigsAndClean(newDirtyFormatData);
      await fse.outputFile(
        this.CONFIG_PATH,
        JSON.stringify(newCleanFormatData, null, 4)
      );
      return newCleanFormatData;
    } catch (error) {
      log.error({
        message: 'Error reading config.',
        error: error.message ? error.message : error,
      });
      return undefined;
    }
  }

  /**
   * Method to convert old config formats to the new current one, perserving settings
   */
  private upgradeConfig(oldData: any) {
    const newConfigData: IConfigInfo = this.DEFAULT_CONFIG;
    // Map old config points to new ones
    if (oldData.echoPath) {
      newConfigData.echoPath = oldData.echoPath;
    }
    if (oldData.remoteApiIpAddress) {
      newConfigData.network.questIP = oldData.remoteApiIpAddress;
    }
    if (oldData.localApiIpAddress) {
      newConfigData.network.localIP = oldData.localApiIpAddress;
    }
    if (oldData.logLevel) {
      newConfigData.dev.logLevel = oldData.logLevel;
    }
    if (oldData.hideUIOnJoin) {
      newConfigData.spectatorOptions.hideUI = oldData.hideUIOnJoin;
    }
    if (oldData.spectateCameraOption) {
      newConfigData.spectatorOptions.mode = oldData.spectateCameraOption;
    }
    return newConfigData;
  }

  /**
   * Method to open the config file with the default app for .json files.
   */
  public openConfigFile() {
    exec(`start ${this.CONFIG_PATH}`);
  }

  public async put(configData: IConfigInfo) {
    const cleanConfigData = this.mergeConfigsAndClean(configData);
    await fse.outputFile(
      this.CONFIG_PATH,
      JSON.stringify(cleanConfigData, null, 4)
    );
    return cleanConfigData;
  }
}
