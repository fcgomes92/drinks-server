import logger from './logger';

export const ERR_404 = 'not_found';
export const ERR_500 = 'server_error';
export function parseError({ code = ERR_500, log = false, err = null }) {
  const error = {
    error: code,
  };
  if (log) logger.error({ ...error, trace: err });
  return;
}
