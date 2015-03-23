var express = require('express'),
        index = require('./controllers/index_controller'),
        user = require('./controllers/users_controller'),
        feed = require('./controllers/feeds_controller'),
        device = require('./controllers/devices_controller'),
        message = require('./controllers/messages_controller'),
        auth = require('./helpers/oauth');
authPhp = require('./helpers/auth_php');
var oauth2 = require('./helpers/oauth2');
var passport = require('passport');
var GCM = require('./helpers/gcm');
var APNS = require('./helpers/apns');
require('./helpers/oauth');

var app = express();

app.use(passport.initialize());
// Use the passport package in our application
//app.use(passport.initialize());


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router



// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


//User APIs (Test Apis)
/*router.get('/users', user.getAllUsers);
 router.post('/users', user.createUser);
 
 //user register
 router.post('/user/register', user.createUser);*/
//user login 
router.post('/user/login', user.loginUser);
/*
 router.get('/user/create', user.createUserUsingGet);
 router.post('/user/create', user.createUserUsingGet);
 
 router.get('/users/:user_id', user.getAUser);
 router.put('/users/:user_id', user.updateUser);
 router.delete('/users/:user_id', user.delAUser);*/

router.post('/oauth/token', oauth2.token);

router.post('/gcm', GCM.sendGCM);
router.post('/apns', APNS.sendAPNS);

router.post('/user/login', passport.authenticate('bearer', {session: false}), user.loginUserApi);


router.get('/', passport.authenticate('bearer', {session: false}), feed.getAllFeeds);

router.get('/feeds', passport.authenticate('bearer', {session: false}), feed.getAllFeeds);


//*******  Message Apis ***********//
// GET Method
/**
 Get all messages router
 @page --- pagenumber for the pagination, only non-zero integers are supported l;ike 1, 2, .... 100, 200 ...
 @limit --- limit the number of results to show in the particular page, again  non-zero integers are supported l;ike 1, 2, .... 100, 200 ...
 **/
router.get('/messages', passport.authenticate('bearer', {session: false}), message.getAllMessages);
router.get('/messages/:page/:limit', passport.authenticate('bearer', {session: false}), message.getLimitedMessages);
/**
 Get a single message
 @message_id --- the id of the message to get
 **/
router.get('/message/:message_id', passport.authenticate('bearer', {session: false}), message.getAMessage);
/**
 Get all message threads for a particular message
 @user_id --- the id of the user for which the messages has to be fetched
 @page --- pagenumber for the pagination, only non-zero integers are supported l;ike 1, 2, .... 100, 200 ...
 @limit --- limit the number of results to show in the particular page, again  non-zero integers are supported l;ike 1, 2, .... 100, 200 ...
 **/
router.get('/threads/message/:message_id', passport.authenticate('bearer', {session: false}), message.getThreads);
/**
 Get all messages for a particular user
 @user_id --- the id of the user for which the messages has to be fetched
 @page --- pagenumber for the pagination, only non-zero integers are supported l;ike 1, 2, .... 100, 200 ...
 @limit --- limit the number of results to show in the particular page, again  non-zero integers are supported l;ike 1, 2, .... 100, 200 ...
 **/
router.get('/user/messages/:user_id/:page/:limit', passport.authenticate('bearer', {session: false}), message.getMessageByUser);
//DELETE Method
router.delete('/messages/:message_id', passport.authenticate('bearer', {session: false}), message.delAMessage);
router.delete('/messages/users/:user_id', passport.authenticate('bearer', {session: false}), message.delMessageByUser);

/**
 Register device
 **/
//register device
router.post('/device/register', passport.authenticate('bearer', {session: false}), device.registerDevice);
//un-register a device
router.delete('/devices/:device_id', passport.authenticate('bearer', {session: false}), device.delADevice);




//expose router to other modules
module.exports = router;