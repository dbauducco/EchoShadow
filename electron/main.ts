/* eslint-disable no-console */
/** *********************************************************************
 ************************ ECHO SHADOW CODE *******************************
 ********************************************************************** */
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
// import { log, Config, EventLogger } from '../src/utilities';

// Repository Imports
// import EchoDataRepository from '../src/repositories/EchoDataRepository';

// Manager Imports
// import EchoVRManager from '../src/managers/EchoVRManager';
// import ShadowEventManager from '../src/managers/ShadowEventManager';
// import MatchEventManager from '../src/managers/MatchEventManager';
// import OBSManager from '../src/managers/OBSManager';
// import SpectatorManager from '../src/managers/SpectatorManager';
// import EchoDataEventManager from '../src/managers/EchoDataEventManager';
// import ShadowStateManager from '../src/managers/ShadowStateManager';
// import EchoDataRedirectManager from '../src/managers/EchoDataRedirectManager';
// import GestureRecognizerManager from '../src/managers/GestureRecognizerManager';
// import EchoVRClient from '../src/clients/EchoVRClient';

/** *********************************************************************
 ********************* BOILERPLATE ELECTRON *****************************
 ********************************************************************** */

const setup = async () => {
  // const config = new Config();
  // await config.init();
  // const configData = config.options;
  // if (!configData) {
  //   log.error({ message: 'Error initializing config' });
  //   throw new Error('Error initializing config');
  // }
  // log.info({ message: 'config', loadedConfig: configData });
  // const echoVrClient = new EchoVRClient(configData);
  // const remoteEchoDataRepository = new EchoDataRepository(
  //   configData.network.questIP,
  //   configData.network.questPort
  // );
  // const localEchoDataRepository = new EchoDataRepository(
  //   configData.network.localIP,
  //   configData.network.localPort
  // );
  // // subscribes to events
  // new EchoVRManager(echoVrClient);
  // return {
  //   log,
  //   remoteEchoDataRepository,
  //   localEchoDataRepository,
  //   echoVrClient,
  //   configData,
  // };
};

const start = async () => {
  try {
    // const {
    //   remoteEchoDataRepository,
    //   localEchoDataRepository,
    //   echoVrClient,
    //   configData,
    // } = await setup();
    // const standardEventSubscribers = [
    //   new EventLogger(),
    //   new ShadowStateManager(configData),
    // ];
    // if (configData.redirectAPI.enabled) {
    //   // Only startup the redirect service
    //   new EchoDataRedirectManager(configData, remoteEchoDataRepository);
    // } else {
    //   // Start up the rest of the services
    //   const shadowEventSubscribers = [
    //     new ShadowEventManager(),
    //     new OBSManager(),
    //     new MatchEventManager(localEchoDataRepository),
    //     new SpectatorManager(configData, echoVrClient),
    //     //new GestureRecognizerManager(),
    //   ];
    //   const echoDataEventManager = new EchoDataEventManager(
    //     localEchoDataRepository,
    //     remoteEchoDataRepository
    //   );
    //   echoDataEventManager.start();
    // }
    // return configData;
  } catch (error) {
    // log.error({
    //   message: 'unhandled exception',
    //   error: error.messsage || error,
    // });
    throw error;
  }
};

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  const defaultWidth = 450;
  const defaultHeight = 240;
  const configWidth = 1200;
  const configHeight = 1000;
  mainWindow = new BrowserWindow({
    width: defaultWidth,
    height: defaultHeight,
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
  //mainWindow.setAlwaysOnTop(true, 'screen-saver');
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

  ipcMain.on('open-config', () => {
    mainWindow?.setSize(configWidth, configHeight);
  });

  ipcMain.on('close-config', () => {
    mainWindow?.setResizable(true);
    mainWindow?.setSize(defaultWidth, defaultHeight);
    mainWindow?.setResizable(false);
  });
}

app
  .on('ready', createWindow)
  .whenReady()
  .then(async () => {
    // start Echo Shadow
    // const configOptions = await start();
    // if (configOptions?.dev.debugUI) {
    //   mainWindow?.webContents.openDevTools();
    // }
  });
app.allowRendererProcessReuse = true;
