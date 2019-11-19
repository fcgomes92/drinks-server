import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express from 'express';
import expressWs from 'express-ws';
import http from 'http';
import settings from './settings';
import { ERR_404, ERR_500, parseError } from './utils/errors';
import logger from './utils/logger';

const app = express();
app.use(cors(settings.cors));
app.use(urlencoded({ extended: true }));
app.use(json({ type: 'application/json' }));
expressWs(app);
const api = require('./api/index').default;

Object.values(api).forEach(endpoint => app.use(endpoint.route, endpoint.router));

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
  app.listen(settings.app.port, () => {
    logger.info(`Running app (v${settings.app.version}) in ${settings.app.port} DEBUG: (${settings.app.debug})`);
  });
}

export default app;
