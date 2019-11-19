import uuid4 from 'uuid/v4';
import winston from 'winston';
import { servers } from '../database/database';
import { checkServer, hashPassword } from '../utils/auth';

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

export const connectToServer = async (ws, req) => {
  try {
    const doc = await servers.get(req.params.id);
    const password = getPassword(req);
    const { token } = req.query;
    if (!(await checkServer(doc, password))) return res.status(401).json({});
    doc.users = [...(doc.users || []), req.user.user_id];
    await servers.put(doc);
    ws.on('message', () => {
      return ws.send(JSON.stringify({ error: false, code: 200 }));
    });
    ws.send(JSON.stringify({ error: false, code: 200 }));
  } catch (error) {
    winston.error({ error });
    return ws.send(JSON.stringify({ error: true, code: 400 }));
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
