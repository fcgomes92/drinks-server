import { Router } from 'express';
import uuid4 from 'uuid/v4';
import { servers } from '../database/database';
import { requireAuthentication } from '../middlewares/auth';
import routes from './routes';
import { encryption, hashPassword } from '../utils/auth';
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

export default {
  router,
  route: routes.servers.base('v1'),
};
