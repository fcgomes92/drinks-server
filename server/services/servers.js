import uuid4 from 'uuid/v4';
import { servers, users } from '../database/database';
import { hashPassword } from '../utils/auth';
import logger from '../utils/logger';
import { wsToJson } from '../utils/websocket';

export const getAllServers = async (req, res) => {
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

export const createServer = async (req, res, next) => {
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
};

const handleServerMessage = async ({ type = 'no_type', server, ...rest }) => {
  const success = {
    type,
    error: false,
    code: 200,
  };
  switch (type) {
    case 'users': {
      console.log(server.users);
      const { docs: serverUsers } = await users.find({
        selector: {
          _id: { $in: server.users },
        },
      });
      console.log(serverUsers);
      return {
        ...success,
        data: {
          users: serverUsers,
        },
      };
    }
    case 'time':
      return { ...success, data: { now: new Date() } };
    case 'echo':
    default:
      return { ...success, data: { ...rest } };
  }
};

export const connectToServer = async (ws, req, next) => {
  try {
    const doc = await servers.get(req.params.id);
    doc.users = [...(doc.users || []), req.user.user_id];
    await servers.put(doc);
    ws.on('message', async data => {
      try {
        const _data = JSON.parse(data);
        return wsToJson(ws, { data: await handleServerMessage({ ..._data, server: doc }) });
      } catch (error) {
        logger.error(error);
        return wsToJson(ws, { data: { code: error.message, error: true, data: { error } } });
      }
    });
    req.data = { error: false, code: 200, type: 'connection', data: {} };
    return next();
  } catch (error) {
    logger.error({ error });
    return wsToJson(ws, { data: { error: true, code: 400, data: {} } });
  }
};

export const deleteServer = async (req, res) => {
  try {
    const doc = await servers.get(req.params.id);
    await servers.remove(doc);
    return res.status(200).json({});
  } catch (error) {
    return res.status(400).json({});
  }
};
