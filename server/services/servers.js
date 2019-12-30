import uuid4 from 'uuid/v4';
import { servers } from '../database/database';
import { checkServerPassword, hashPassword } from '../utils/auth';
import logger from '../utils/logger';

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

export const connectToServer = async (ws, req, next) => {
  try {
    const doc = await servers.get(req.params.id);
    doc.users = [...(doc.users || []), req.user.user_id];
    await servers.put(doc);
    ws.on('message', data => {
      const _data = JSON.parse(data);
      const { type = 'no_type' } = _data;
      switch (type) {
        case 'time':
          return ws.send(
            JSON.stringify({
              error: false,
              code: 200,
              data: {
                now: new Date(),
                user: req.user.email,
              },
              type,
            }),
          );
        case 'echo':
        default:
          return ws.send(
            JSON.stringify({
              error: false,
              code: 200,
              data: {
                ..._data,
                user: req.user.email,
              },
              type,
            }),
          );
      }
    });
    ws.send(JSON.stringify({ error: false, code: 200, type: 'connection', data: {} }));
  } catch (error) {
    logger.error({ error });
    return ws.send(JSON.stringify({ error: true, code: 400, data: {} }));
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

function handleMessageType({ type, ws, data }) {
  switch (type) {
    default:
  }
}

function onNewClient() {}
