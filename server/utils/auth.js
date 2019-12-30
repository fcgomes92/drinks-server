import bcrypt from 'bcrypt';
import * as admin from 'firebase-admin';
import settings from '../settings';

admin.initializeApp({
  credential: admin.credential.cert(settings.firebase.gac),
});

export const hashPassword = async function(data) {
  return await new Promise((resolve, reject) => {
    bcrypt.hash(data, 10, function(err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
};

export const checkServerPassword = function(server, data) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(data, server.password, function(err, same) {
      if (err) reject(err);
      resolve(same);
    });
  });
};

export const getPassword = req => {
  if (req.body && req.body.password) {
    return req.body.password;
  }
  if (req.query && req.query.password) {
    return req.query.password;
  }
  return null;
};

export default admin;
