import admin from '../utils/auth';
import logger from '../utils/logger';
import { users } from '../database/database';

const getAuthToken = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    req.authToken = req.headers.authorization.split(' ')[1];
  } else {
    req.authToken = null;
  }
  next();
};

export const requireAuthentication = async (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin.auth().verifyIdToken(authToken);
      req.authId = userInfo.uid;
      req.user = userInfo;
      users.put({
        _id: req.user.user_id,
        email: req.user.email,
      });
      return next();
    } catch (e) {
      logger.error({ error: e });
      return res.status(401).json({ error: 'not_authorized' });
    }
  });
};
