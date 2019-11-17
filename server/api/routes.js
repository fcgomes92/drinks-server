const baseUri = '/api';

export default {
  health: {
    base: version => `${baseUri}/${version}/health`,
    get: () => '/',
  },
  version: {
    base: () => '/version',
    v: () => '/',
  },
  auth: {
    base: version => `${baseUri}/${version}/auth`,
    post: () => '/',
  },
  servers: {
    base: version => `${baseUri}/${version}/servers`,
    get: () => '/',
    register: () => '/register',
  },
  clients: {
    base: version => `${baseUri}/${version}/clients`,
  },
};
