import { Router } from 'express';
import { requireAuthentication, requireAuthenticationWs } from '../middlewares/auth';
import { connectToServer, createServer, deleteServer, getAllServers } from '../services/servers';
import routes from './routes';
import { wsToJson } from '../utils/websocket';

const router = Router();

router.get(routes.servers.get(), requireAuthentication, getAllServers);

router.post(routes.servers.register(), requireAuthentication, createServer, getAllServers);

router.ws(routes.servers.connect(), requireAuthenticationWs, connectToServer, wsToJson);

router.delete(routes.servers.id(), requireAuthentication, deleteServer);

export default {
  router,
  route: routes.servers.base('v1'),
};
