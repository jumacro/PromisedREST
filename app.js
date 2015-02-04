var express             = require('express')
    ,   path            = require('path')
    ,   logger          = require('morgan')
    ,   cookieParser    = require('cookie-parser')
    ,   bodyParser      = require('body-parser');
var passport = require('passport');

var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));


// declaring the router file
var router = require('./app/routers');

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /v1
app.use('/v1', router);

//expose app to other modules
module.exports = app;