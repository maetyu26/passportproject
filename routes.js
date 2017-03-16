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

	app.post('/signup', function (req, res, next) {
    passport.authenticate('local', {failureRedirect: '/login'},
        function (req, email, password, done) {
            process.nextTick(function () {
                User.findOne({'local.email': email}, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That e-mail address is already taken.'));
                    } else {
                        var newUser = new User;
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save(function (err) {
                            if (err){
                                throw err;}
                            //res.redirect("/path")        
                            return done(null, newUser);
                        });
                    }
                });
            });
        });
});

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