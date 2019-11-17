import PouchDB from 'pouchdb';
import memory from 'pouchdb-adapter-memory';
PouchDB.plugin(memory);

export const users = new PouchDB('users', { adapter: 'memory' });
export const servers = new PouchDB('servers', { adapter: 'memory' });
export const clients = new PouchDB('clients', { adapter: 'memory' });
