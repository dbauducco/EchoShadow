/***********************************************************************
 ************************ECHO SHADOW CODE*******************************
 ***********************************************************************/
import EchoInstanceClient from './clients/EchoInstanceClient';
import EchoDataRepository from './repositories/EchoDataRepository';
import Config from './utilities/Config';
import { log } from './utilities/log';
import EchoFollowManager from './managers/EchoFollowManager';

const setup = async () => {
  const config = new Config();
  await config.init();
  if (!config.options) {
    log.error({ message: 'Error initializing config' });
    throw new Error('Error initializing config');
  }
  log.info({ loadedConfig: config.options });
  const echoInstanceClient = new EchoInstanceClient(config.options.echoPath);
  const remoteEchoDataRepository = new EchoDataRepository(
    config.options.remoteApiIpAddress
  );
  const localEchoDataRepository = new EchoDataRepository(
    config.options.localApiIpAddress
  );
  return {
    echoInstanceClient,
    remoteEchoDataRepository,
    localEchoDataRepository,
  };
};

const start = async () => {
  const {
    echoInstanceClient,
    remoteEchoDataRepository,
    localEchoDataRepository,
  } = await setup();
  const followManager = new EchoFollowManager(
    remoteEchoDataRepository,
    localEchoDataRepository,
    echoInstanceClient
  );
  await followManager.startFollowing();
};

/***********************************************************************
 *(********************BOILERPLATE ELECTRON*****************************
 ***********************************************************************/

import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // mainWindow.webContents.openDevTools();

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

  // start Echo Shadow
  start();
}

app
  .on('ready', createWindow)
  .whenReady()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log('An error occurred: ', err));
      installExtension(REDUX_DEVTOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log('An error occurred: ', err));
    }
  });
app.allowRendererProcessReuse = true;
