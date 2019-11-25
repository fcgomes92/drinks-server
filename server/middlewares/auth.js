import admin, { getPassword } from '../utils/auth';
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
      req.user = userInfo;
      users.put({
        _id: req.user.user_id,
        uid: req.user.uid,
        email: req.user.email,
      });
      return next();
    } catch (e) {
      logger.error({ error: e });
      return res.status(401).json({ error: 'not_authorized' });
    }
  });
};

export const requireAuthenticationWs = async (ws, req, next) => {
  try {
    const token = req.query.token;
    const userInfo = await admin.auth().verifyIdToken(token);
    req.user = userInfo;
    users.put({
      _id: req.user.user_id,
      uid: req.user.uid,
      email: req.user.email,
    });
    return next();
  } catch (e) {
    logger.error({ error: e });
    throw new Error();
  }
};

export const requireServerAuthenticationWs = async (ws, req, next) => {
  const { id } = req.params;
  const doc = await servers.get(id);
  const password = getPassword(req);
  if (!(await checkServerPassword(doc, password))) ;
  next();
};
