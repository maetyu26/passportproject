// load dependencies
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// define user schema
var userSchema = mongoose.Schema({
	local: {
		email: String,
		password: String
	}
});

// METHODS
// generating a hash

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// creating model for user to expose to app
module.exports = mongoose.model('User', userSchema);