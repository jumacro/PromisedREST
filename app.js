/**
* Initializing the Express essentials
**/
var express         = require('express'),
    path            = require('path'),
    logger          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    passport        = require('passport');

var app             = express();

/** Declaring the database connection **/
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fondoo');


/** Middlewares **/


/** load the logger **/
app.use(logger('dev'));
/** load the body parser middleware **/
app.use(bodyParser.json());
/** load the url endoers middleware **/
app.use(bodyParser.urlencoded({ extended: false }));
/** load the cookie parser middleware **/
app.use(cookieParser());
/** Initialize Passport.js **/
app.use(passport.initialize());

/** Router file declaration **/
var router = require('./app/routers');

/** Registration of the route middleware **/
app.use('/api/v1.0', router);

/** Expose app to other modules **/
module.exports = app;