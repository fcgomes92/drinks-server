import { Router } from 'express';
import { requireAuthentication, requireAuthenticationWs } from '../middlewares/auth';
import { createServer, deleteServer, getAllServers } from '../services/servers';
import routes from './routes';

const router = Router();

router.get(routes.servers.get(), requireAuthentication, getAllServers);

router.post(routes.servers.register(), requireAuthentication, createServer, getAllServers);

router.ws(routes.servers.connect(), requireAuthenticationWs, connectToServer);

router.delete(routes.servers.id(), requireAuthentication, deleteServer);

export default {
  router,
  route: routes.servers.base('v1'),
};
