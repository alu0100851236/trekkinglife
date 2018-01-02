// let Datos = require('../app/models/datos');

// let getDato = require('../app/models/getDatos.js');
// let getDatos = getDato.getDatos;

module.exports = (app, passport) => {

	// index routes
	app.get('/', (req, res) => {
		res.render('index');
	});
	
	//login view
	app.get('/login_err', (req, res) => {
		res.render('login_err.ejs', {
			message: req.flash('loginMessage')
		});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/home',
		failureRedirect: '/login_err',
		failureFlash: true
	}));

	// signup view
	app.get('/signup_err', (req, res) => {
		res.render('signup_err', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/home',
		failureRedirect: '/signup_err',
		failureFlash: true // allow flash messages
	}));

	//profile view
	app.get('/home', isLoggedIn, (req, res) => {
		res.render('home', {
			user: req.user
		});
	});

	// logout
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}