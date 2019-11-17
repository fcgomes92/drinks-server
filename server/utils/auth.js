// firebase.initializeApp({
//     serviceAccount: "path/to/serviceAccountCredentials.json",
//     databaseURL: "https://databaseName.firebaseio.com"
// });

// var FirebaseStrategy = require('passport-firebase-auth').Strategy;

// passport.use(new FirebaseStrategy({
//     firebaseProjectId: "project-id",
//     authorizationURL: 'https://account.example.net/auth',
//     callbackURL: 'https://www.example.net/auth/firebase/callback'
//   },
//   function(accessToken, refreshToken, decodedToken, cb) {
//     User.findOrCreate(..., function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

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

export const checkServer = async function(server, data) {
  return await new Promise((resolve, reject) => {
    bcrypt.compare(server.password, data, function(err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
};

export default admin;
