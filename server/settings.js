import { version } from '../package.json';
export default {
loggerLevel: process.env.LOGGER_LEVEL || 'info',
  app: {
    version,
    mode: process.env.NODE_ENV,
    debug: process.env.NODE_ENV === 'development',
    port: process.env.PORT || 3000,
  },
  cors: {
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  },
};
