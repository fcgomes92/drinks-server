import PouchDB from 'pouchdb';
import memory from 'pouchdb-adapter-memory';
PouchDB.plugin(memory);
const LocalPouch = PouchDB.defaults({
  prefix: '/database',
});

export const users = new LocalPouch('users');
export const servers = new LocalPouch('servers');
export const clients = new LocalPouch('clients');
