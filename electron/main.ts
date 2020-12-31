/* eslint-disable no-console */
/** *********************************************************************
 ************************ECHO SHADOW CODE*******************************
 ********************************************************************** */
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { log, Config, EventLogger, focusWindow } from '../src/utilities';

// Repository Imports
import EchoDataRepository from '../src/repositories/EchoDataRepository';

// Manager Imports
import EchoVRManager from '../src/managers/EchoVRManager';
import ShadowManager from '../src/managers/ShadowEventManager';
import MatchEventManager from '../src/managers/MatchEventManager';
import OBSManager from '../src/managers/OBSManager';
import SpectatorManager from '../src/managers/SpectatorManager';
import EchoDataEventManager from '../src/managers/EchoDataEventManager';
import ShadowStateManager from '../src/managers/ShadowStateManager';

/** *********************************************************************
 *(********************BOILERPLATE ELECTRON*****************************
 ********************************************************************** */

const setup = async () => {
  const config = new Config();
  await config.init();
  const configData = config.options;
  if (!configData) {
    log.error({ message: 'Error initializing config' });
    throw new Error('Error initializing config');
  }
  log.info({ loadedConfig: configData });
  const echoVRManager = new EchoVRManager(configData.echoPath);
  const remoteEchoDataRepository = new EchoDataRepository(
    configData.remoteApiIpAddress
  );
  const localEchoDataRepository = new EchoDataRepository(
    configData.localApiIpAddress
  );
  return {
    log,
    echoVRManager,
    remoteEchoDataRepository,
    localEchoDataRepository,
    configData,
  };
};

const start = async () => {
  try {
    const {
      echoVRManager,
      remoteEchoDataRepository,
      localEchoDataRepository,
      configData,
    } = await setup();
    const eventSubscribers = [
      new EventLogger(),
      new ShadowManager(),
      new OBSManager(),
      new ShadowStateManager(configData),
      new SpectatorManager(echoVRManager),
      new MatchEventManager(localEchoDataRepository),
    ];
    const echoDataEventManager = new EchoDataEventManager(
      localEchoDataRepository,
      remoteEchoDataRepository
    );
    await echoDataEventManager.start();
    return configData;
  } catch (error) {
    log.error({
      message: 'unhandled exception',
      error: error.messsage || error,
    });
    throw error;
  }
};

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 240,
    frame: false,
    resizable: false,
    // backgroundColor: '#f9968e', // PINK MODE
    backgroundColor: '#191622', // Normal Mode
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      backgroundThrottling: false,
    },
  });

  // Set the main window to stay ontop
  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  console.log({ env: process.env.NODE_ENV });
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000');
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../renderer/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app
  .on('ready', createWindow)
  .whenReady()
  .then(async () => {
    // start Echo Shadow
    const configOptions = await start();
    if (configOptions?.debugUI) {
      mainWindow?.webContents.openDevTools();
    }
  });
app.allowRendererProcessReuse = true;
