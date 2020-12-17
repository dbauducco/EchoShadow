/* eslint-disable no-console */
/** *********************************************************************
 ************************ECHO SHADOW CODE*******************************
 ********************************************************************** */
import { app, BrowserWindow, remote } from 'electron';
import * as path from 'path';
import * as url from 'url';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import { log, Config, EventLogger } from '../src/utilities';

// Repository Imports
import EchoDataRepository from '../src/repositories/EchoDataRepository';

// Manager Imports
import EchoVRManager from '../src/managers/EchoVRManager';
import ShadowManager from '../src/managers/ShadowEventManager';
import OBSManager from '../src/managers/OBSManager';
import SpectatorManager from '../src/managers/SpectatorManager';
import EchoDataEventManager from '../src/managers/EchoDataEventManager';

/** *********************************************************************
 *(********************BOILERPLATE ELECTRON*****************************
 ********************************************************************** */

const setup = async () => {
  const config = new Config();
  await config.init();
  if (!config.options) {
    log.error({ message: 'Error initializing config' });
    throw new Error('Error initializing config');
  }
  log.info({ loadedConfig: config.options });
  const echoVRManager = new EchoVRManager(config.options.echoPath);
  const remoteEchoDataRepository = new EchoDataRepository(
    config.options.remoteApiIpAddress
  );
  const localEchoDataRepository = new EchoDataRepository(
    config.options.localApiIpAddress
  );
  return {
    log,
    echoVRManager,
    remoteEchoDataRepository,
    localEchoDataRepository,
  };
};

const start = async () => {
  try {
    const {
      echoVRManager,
      remoteEchoDataRepository,
      localEchoDataRepository,
    } = await setup();
    const eventLogger = new EventLogger();
    const shadowManager = new ShadowManager();
    const obsManager = new OBSManager();
    const spectatorManager = new SpectatorManager(echoVRManager);
    const echoDataEventManager = new EchoDataEventManager(
      localEchoDataRepository,
      remoteEchoDataRepository
    );
    await echoDataEventManager.start();
  } catch (error) {
    log.error({
      message: 'unhandled exception',
      error: error.messsage || error,
    });
  }
};

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 240,
    frame: false,
    resizable: false,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  // mainWindow.webContents.openDevTools();

  // Set the main window to stay ontop
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000');
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
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
    if (process.env.NODE_ENV === 'development') {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log('An error occurred: ', err));
      installExtension(REDUX_DEVTOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log('An error occurred: ', err));
    }
    // start Echo Shadow
    await start();
  });
app.allowRendererProcessReuse = true;
