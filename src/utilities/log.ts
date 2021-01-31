import * as os from 'os';
import * as path from 'path';
import { transports, format, createLogger } from 'winston';

import { LogLevel } from '../types';

const LOG_PATH = path.join(os.homedir(), 'AppData/Local/EchoShadow/logs');

const fileLogFormat = format.timestamp();

const log = createLogger();

const initLogger = (logLevel?: LogLevel) => {
  const logInitDate = new Date()
    .toISOString()
    .split('.')[0]
    .split(':')
    .join('-');

  log.add(
    new transports.File({
      filename: `${LOG_PATH}/error.log-${logInitDate}.json`,
      level: 'error',
      format: fileLogFormat,
    })
  );
  log.add(
    new transports.File({
      filename: `${LOG_PATH}/info.log-${logInitDate}.json`,
      level: 'info',
      format: fileLogFormat,
    })
  );

  if (process.env.NODE_ENV !== 'production') {
    log.add(
      new transports.Console({
        format: format.prettyPrint(),
      })
    );
  }

  if (logLevel === LogLevel.VERBOSE) {
    log.add(
      new transports.File({
        filename: `${LOG_PATH}/verbose.log-${logInitDate}.json`,
        format: fileLogFormat,
        level: 'verbose',
      })
    );
  }

  if (logLevel === LogLevel.DEBUG) {
    log.add(
      new transports.File({
        filename: `${LOG_PATH}/debug.log-${logInitDate}.json`,
        format: fileLogFormat,
        level: 'debug',
      })
    );
  }
};

export { log, initLogger };
