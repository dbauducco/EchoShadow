import * as os from 'os';
import * as path from 'path';
import { transports, format, createLogger } from 'winston';

const LOG_PATH = path.join(os.homedir(), 'AppData/Local/EchoShadow');

const fileLogFormat = format.combine(format.timestamp(), format.json());

const log = createLogger({
  level: 'info',
  transports: [
    new transports.File({
      filename: `${LOG_PATH}/error.log.json`,
      level: 'error',
      format: fileLogFormat,
    }),
    new transports.File({
      filename: `${LOG_PATH}/combined.log.json`,
      format: fileLogFormat,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  log.add(
    new transports.Console({
      format: format.prettyPrint(),
    }),
  );
}

export { log };
