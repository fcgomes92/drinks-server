import logger from './logger';

export const wsToJson = (ws, req) => {
  const { data } = req;
  try {
    return ws.send(JSON.stringify(data));
  } catch (err) {
    logger.error(err);
    return ws.send(JSON.stringify({ error: true, code: 500 }));
  }
};
