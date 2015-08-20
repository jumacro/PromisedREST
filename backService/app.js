/**
* Initializing the Express essentials
**/
var express         = require('express'),
    path            = require('path'),
    logger          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    passport        = require('passport'),
    cors            = require('cors'),
    Config          = require('./app/Config/Config'),
    db              = Config.db.remote,
    //db              = Config.db.local,
    mongoose        = require('mongoose');

var app             = express();


var getConnectionString = function (dbConfig) {
    //TODO use json object to connect to db, see mongoose docs
    if (db.options) {
        return 'mongodb://' + dbConfig.options.username + ':' + dbConfig.options.password +
            '@' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.dbName;
    } else {
        return 'mongodb://' + dbConfig.host + '/' + dbConfig.dbName;
    }
}

// connect to our database
mongoose.connect(getConnectionString(db), function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Started fondoo database');
});


/** Declaring the database connection **/
//var mongoose = require('mongoose');
//mongoose.connect('mongodb://' + Config.db.host + '/' + Config.db.database);

/** Middlewares **/

/** load the logger **/
app.use(logger('dev'));
/** load the body parser middleware **/

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/** load the cookie parser middleware **/
app.use(cookieParser());
/** Initialize Passport.js **/
app.use(passport.initialize());



/** Router file declaration **/
var router = require('./app/routers');

app.use(cors({
    origin: true,
    methods: 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
    allowedHeaders: 'Origin, Content-Type, Accept, Authorization, X-Request-With, Content-Range, Content-Disposition, Content-Description',
    credentials: true,

}));




/** Registration of the route middleware **/
app.use('/' + Config.apiVersion, router);

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