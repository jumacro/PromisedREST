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
    Config          = require('./server/Config/Config'),
    db              = Config.db.remote,
    //db              = Config.db.local,
    mongoose        = require('mongoose');

var server             = express();


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
    console.log('Started resty database');
});


/** Middlewares **/

/** load the logger **/
server.use(logger('dev'));
/** load the body parser middleware **/

// configure body parser
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
/** load the cookie parser middleware **/
server.use(cookieParser());
/** Initialize Passport.js **/
server.use(passport.initialize());

/*** SET UP ANGULAR FRONT END ***/

server.use(express.static(__dirname + '/client/app'));

server.get('/', function(req, res){
  res.redirect('/index.html');
});


/** Router file declaration **/
var router = require('./server/routers');

/** CORS SET UP **/

server.use(cors({
    origin: true,
    methods: 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
    allowedHeaders: 'Origin, Content-Type, Accept, Authorization, X-Request-With, Content-Range, Content-Disposition, Content-Description',
    credentials: true,

}));

/*************************************************************************************************

/** Registration of the route middleware **/
server.use('/' + Config.apiVersion, router);

// catch 404 and forward to error handler
server.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (server.get('env') === 'development') {
    server.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log(err);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
server.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.json({
        message: err.message,
        error: err
    });
});

/** Expose server to other modules **/
module.exports = server;