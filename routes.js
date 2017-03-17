var User = require("./user");

module.exports = function(app, passport) {
	app.get('/', function (req, res) {
  		res.render('pages/index');
	});

	app.get('/login', function (req, res) {
		res.render('pages/login', { message: req.flash('loginMessage') });
	});

	app.get('/signup', function (req, res) {
  		res.render('pages/signup', { message: req.flash('signupMessage') });
	});

	    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user: req.user
		});
	});

	app.get('/addroom', function (req, res) {
		res.render('pages/addroom.ejs', {
			message: req.flash('addroomMessage')
		});
	});

	app.get('/propconfig', function (req, res) {
		res.render('pages/propconfig.ejs', {
			message: req.flash('propconfigMessage')
		});
	});
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to ensure a user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}
