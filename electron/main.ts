/* eslint-disable no-console */
/** *********************************************************************
 ************************ECHO SHADOW CODE*******************************
 ********************************************************************** */
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { log, Config } from '../src/utilities';
import * as utils from '../src/utilities/utils';
import EchoInstanceClient from '../src/clients/EchoInstanceClient';
import EchoDataRepository from '../src/repositories/EchoDataRepository';
import EchoFollowManager from '../src/managers/EchoFollowManager';

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
  const echoInstanceClient = new EchoInstanceClient(config.options.echoPath);
  const remoteEchoDataRepository = new EchoDataRepository(
    config.options.remoteApiIpAddress
  );
  const localEchoDataRepository = new EchoDataRepository(
    config.options.localApiIpAddress
  );
  return {
    config,
    log,
    echoInstanceClient,
    remoteEchoDataRepository,
    localEchoDataRepository,
  };
};

const start = async () => {
  try {
    const {
      config,
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
    return config;
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
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
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
    const go = async () => {
      await utils.sleep(3000);
      await utils.focusWindow('Calculator');
      await utils.keyboard.typeString('23+37=');
    };

    await go();

    // start Echo Shadow
    const config = await start();
    if (config?.options?.debugUI) {
      mainWindow?.webContents.openDevTools();
    }
  });
app.allowRendererProcessReuse = true;
