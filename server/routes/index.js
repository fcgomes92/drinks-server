app.get('/auth/firebase',
  passport.authenticate('firebaseauth', { }));

app.get('/auth/firebase/callback', 
  passport.authenticate('firebaseauth', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });