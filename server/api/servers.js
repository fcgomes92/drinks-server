import { Router } from 'express';
import uuid4 from 'uuid/v4';
import { servers } from '../database/database';
import { requireAuthentication, requireAuthenticationWs } from '../middlewares/auth';
import routes from './routes';
import { hashPassword, checkServer } from '../utils/auth';
import logger from '../utils/logger';
const router = Router();

const getAllServers = async (req, res) => {
  try {
    const { rows } = await servers.allDocs({
      include_docs: true,
      attachments: true,
    });
    const data = rows.reduce((acc, { doc }) => {
      return { ...acc, [doc._id]: { ...doc } };
    }, {});
    return res.status(200).json({ data });
  } catch (err) {
    throw new Error('error_getting_servers');
  }
};

router.get(routes.servers.get(), requireAuthentication, getAllServers);

router.post(
  routes.servers.register(),
  requireAuthentication,
  async (req, res, next) => {
    try {
      const password = await hashPassword(req.body.password);
      await servers.put({
        _id: uuid4(),
        name: req.body.name,
        password,
        created_at: new Date(),
      });
      next();
    } catch (error) {
      throw new Error('error_registering_server');
    }
  },
  getAllServers,
);

const getPassword = req => {
  if (req.body && req.body.password) {
    return req.body.password;
  }
  if (req.query && req.query.password) {
    return req.query.password;
  }
};

const connectToServer = async (ws, req) => {
  try {
    const doc = await servers.get(req.params.id);
    const password = getPassword(req);
    const token = req.query.token;
    if (!(await checkServer(doc, password))) return res.status(401).json({});
    doc.users = [...(doc.users || []), req.user.user_id];
    await servers.put(doc);
    ws.on('message', () => {
      return ws.send(JSON.stringify({ error: false, code: 200 }));
    });
    ws.send(JSON.stringify({ error: false, code: 200 }));
  } catch (error) {
    console.log(error);
    return ws.send(JSON.stringify({ error: true, code: 400 }));
  }
};

router.ws(routes.servers.connect(), requireAuthenticationWs, connectToServer);

router.delete(routes.servers.id(), requireAuthentication, async (req, res) => {
  try {
    const doc = await servers.get(req.params.id);
    await servers.remove(doc);
    return res.status(200).json({});
  } catch (error) {
    return res.status(400).json({});
  }
});

export default {
  router,
  route: routes.servers.base('v1'),
};
