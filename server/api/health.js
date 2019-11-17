import { Router } from 'express';

import routes from './routes';

const router = Router();

router.get(routes.health.get(), (req, res) => res.status(200).json({ healthy: true }));

export default {
  route: routes.health.base('v1'),
  router,
};
