/* eslint-disable no-console */
/** *********************************************************************
 ************************ECHO SHADOW CODE*******************************
 ********************************************************************** */
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import * as ffi from 'ffi-napi';
import { log, Config } from '../src/utilities';
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
    log,
    echoInstanceClient,
    remoteEchoDataRepository,
    localEchoDataRepository,
  };
};

const start = async () => {
  try {
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

const testFocus = () => {
  const user32 = new ffi.Library('user32', {
    GetTopWindow: ['long', ['long']],
    FindWindowA: ['long', ['string', 'string']],
    SetActiveWindow: ['long', ['long']],
    SetForegroundWindow: ['bool', ['long']],
    BringWindowToTop: ['bool', ['long']],
    ShowWindow: ['bool', ['long', 'int']],
    SwitchToThisWindow: ['void', ['long', 'bool']],
    GetForegroundWindow: ['long', []],
    AttachThreadInput: ['bool', ['int', 'long', 'bool']],
    GetWindowThreadProcessId: ['int', ['long', 'int']],
    SetWindowPos: [
      'bool',
      ['long', 'long', 'int', 'int', 'int', 'int', 'uint'],
    ],
    SetFocus: ['long', ['long']],
  });

  const kernel32 = new ffi.Library('Kernel32.dll', {
    GetCurrentThreadId: ['int', []],
  });

  const winToSetOnTop = user32.FindWindowA(null, 'calculator');
  const foregroundHWnd = user32.GetForegroundWindow();
  const currentThreadId = kernel32.GetCurrentThreadId();
  const windowThreadProcessId = user32.GetWindowThreadProcessId(
    foregroundHWnd,
    null
  );
  const showWindow = user32.ShowWindow(winToSetOnTop, 9);
  const setWindowPos1 = user32.SetWindowPos(winToSetOnTop, -1, 0, 0, 0, 0, 3);
  const setWindowPos2 = user32.SetWindowPos(winToSetOnTop, -2, 0, 0, 0, 0, 3);
  const setForegroundWindow = user32.SetForegroundWindow(winToSetOnTop);
  const attachThreadInput = user32.AttachThreadInput(
    windowThreadProcessId,
    currentThreadId,
    0
  );
  const setFocus = user32.SetFocus(winToSetOnTop);
  const setActiveWindow = user32.SetActiveWindow(winToSetOnTop);
};

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
    testFocus();
  });
app.allowRendererProcessReuse = true;
