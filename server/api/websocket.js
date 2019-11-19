import WebSocket from 'ws';
import settings from '../settings';
import routes from './routes';

export const configureWebSocket = server => {
  const path = `${routes.servers.base('v1')}${routes.servers.connect()}`;
  const wss = new WebSocket.Server({ server, path });
};
