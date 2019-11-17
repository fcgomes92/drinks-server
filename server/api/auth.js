import { Router } from 'express';
import { requireAuthentication } from '../middlewares/auth';
import routes from './routes';

const router = Router();

router.post(routes.auth.post(), requireAuthentication, (req, res) => {
  return res.status(200).json({ protected: 'ok' });
});

export default {
  route: routes.auth.base('v1'),
  router,
};
