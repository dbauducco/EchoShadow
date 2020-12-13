import * as os from 'os';
import * as path from 'path';
import { transports, format, createLogger } from 'winston';

import { LogLevel } from '../types';

const LOG_PATH = path.join(os.homedir(), 'AppData/Local/EchoShadow');

const fileLogFormat = format.combine(format.timestamp(), format.prettyPrint());

const log = createLogger({
  level: 'info',
  transports: [
    new transports.File({
      filename: `${LOG_PATH}/error.log.json`,
      level: 'error',
      format: fileLogFormat,
    }),
    new transports.File({
      filename: `${LOG_PATH}/info.log.json`,
      level: 'info',
      format: fileLogFormat,
    }),
  ],
});

const initLogger = (logLevel?: LogLevel) => {
  if (process.env.NODE_ENV !== 'production') {
    log.add(
      new transports.Console({
        format: format.prettyPrint(),
      })
    );
  }

  if (logLevel === LogLevel.DEBUG) {
    log.add(
      new transports.File({
        filename: `${LOG_PATH}/debug.log.json`,
        format: fileLogFormat,
      })
    );
  }
};

export { log, initLogger };
