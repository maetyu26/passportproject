var LocalStrategy = require('passport-local').Strategy;

var User = require('../user');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		console.log("req.body: " + JSON.stringify(req.body));
		process.nextTick(function() {
			User.findOne({ 'local.email': email }, function(err, user) {
				if (err)
					console.log(err);
					return done(err);
				if (user) {
					return done(null, false, req.flash('signupMessage', 'That e-mail address is already taken.'));
				} else {
					var newUser = new User;
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					newUser.$__save(function(err) {
						if (err)
							console.log(err);
							throw err;
						console.log(User);
						console.log(newUser);
						console.log(newUser.$__save);
						return done(null, newUser);
						console.log(newUser.$__save);
					});
				}
			});
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		User.findOne({ 'local.email': email }, function(err, user) {
			if (err)
				return done(err);
			if (!user)
				return done(null, false, req.flash('loginMessage', 'User not found.'));
			if(!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Invalid password, please try again.'));
			return done(null, user);
		});
	}));
};