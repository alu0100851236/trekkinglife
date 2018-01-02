const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/user');
// const Datos = require('../app/models/datos');

module.exports = function (passport) {
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // Signup
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function (req, email, password, done) {
    User.findOne({'local.email': email}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, req.flash('signupMessage', 'El email está en uso'));
      } else {
        var nombre = req.body.nombre;
        var apellidos = req.body.apellidos;
        var contacto = req.body.contacto;
        var telefono = req.body.telefono;
        var newUser = new User();
        newUser.local.nombre = nombre;
        newUser.local.apellidos = apellidos;
        newUser.local.contacto = contacto;
        newUser.local.telefono = telefono;
        newUser.local.email = email;
        newUser.local.password = newUser.generateHash(password);
        
        newUser.save(function (err) {
          if (err) { throw err; }
          return done(null, newUser);
        });
      }
    });
  }));
  
  

  // login
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, email, password, done) {
    User.findOne({'local.email': email}, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'Usuario no econtrado'))
      }
      if (!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Contraseña incorrecta'));
      }
      return done(null, user);
    });
  }));
}