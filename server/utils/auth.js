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