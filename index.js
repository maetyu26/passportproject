// load dependencies
var express = require('express');
var app = express();
var path = require('path');

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');

var configDB = require('./config/database.js');

// setup views
var ejs = require('ejs');
var engine = require('ejs-locals');

//database configuration
mongoose.connect(configDB.url, function(err, db) {
	if (!err) {
		console.log("Connection to database successful: connected to " + configDB.url);
	}
});

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({ 
	secret: 'ilovescotchscotchyscotchscotch',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // for flash messages stored in-session

// routes
require('./routes')(app, passport);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});