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
    register: () => '/',
    id: (id = ':id') => `/${id}`,
    connect: (id = ':id') => `/${id}/connect`,
  },
  clients: {
    base: version => `${baseUri}/${version}/clients`,
  },
};
