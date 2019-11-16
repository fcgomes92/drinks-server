import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import settings from './settings';
import logger from './utils/logger';
import { ERR_500, parseError, ERR_404 } from './utils/errors';

const app = express();
app.use(cors(settings.cors));
app.use(urlencoded({ extended: true }));
app.use(json({ type: 'application/json' }));
// const app = configureWebSocket(app);

const server = http.createServer(app);

// Object.values(api).forEach(endpoint => app.use(endpoint.route, endpoint.router));

app.get('/', (req, res) => {
  return res.status(200).json({ ok: 'ok' });
});

app.use((req, res) => {
  return res.status(404).json(parseError({ code: ERR_404 }));
});

app.use((err, req, res) => {
  return res.status(500).json(parseError({ code: ERR_500, err, log: true }));
});

if (settings.app.mode !== 'test') {
  server.listen(settings.app.port, () => {
    logger.info(`Running app (v${settings.app.version}) in ${settings.app.port} DEBUG: (${settings.app.debug})`);
  });
}

export default server;
