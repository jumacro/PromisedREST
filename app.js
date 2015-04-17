/**
* Initializing the Express essentials
**/
var express         = require('express'),
    path            = require('path'),
    logger          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    passport        = require('passport'),
    Config			= require('./app/Config/Config');

var app             = express();

/** Declaring the database connection **/
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + Config.host + '/' + Config.database);

/** Middlewares **/

/** load the logger **/
app.use(logger('dev'));
/** load the body parser middleware **/

/** load the url endoers middleware **/
app.use(bodyParser.urlencoded({ extended: true }));
/** load the cookie parser middleware **/
app.use(cookieParser());
/** Initialize Passport.js **/
app.use(passport.initialize());

/** Router file declaration **/
var router = require('./app/routers');

/** Registration of the route middleware **/
app.use('/api/' + Config.apiVersion, router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

/** Expose app to other modules **/
module.exports = app;