import winston from 'winston';
import settings from '../settings';

const logger = winston.createLogger({
  level: settings.loggerLevel,
  format: winston.format.combine(
    ...[
      winston.format.timestamp(),
      ...(settings.app.debug ? [winston.format.colorize()] : []),
      ...(settings.app.debug ? [winston.format.prettyPrint()] : [winston.format.json()]),
    ],
  ),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      name: 'console.info',
      colorize: settings.app.debug,
      showLevel: true,
    }),
  ],
});

export default logger;
