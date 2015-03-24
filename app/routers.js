/**
* Initializing the Router essentials
**/
var express     = require('express'),
    Passport    = require('passport'),
    Auth        = require('./Component/Oauth'),
    Oauth2      = require('./Component/Oauth2'),    
    GCM         = require('./Component/GCM'),
    APNS        = require('./Component/APN'),
    User        = require('./Controller/UsersController'),
    app         = express();

/** Created an instance of the express Router **/
var router = express.Router(); 

/** Initialize Passport.js **/
app.use(Passport.initialize());

/** Middleware to use for all requests **/
router.use(function(req, res, next) {
    /** Set up the Access Control Headers **/
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    console.log('Access Control Headers are set.'); //must be removed from production
    next(); // make sure we go to the next routes and don't stop here
});

/** ROUTER DECLARATION STARTS HERE **/

router.post('/oauth/token', Oauth2.token);

router.post('/gcm', GCM.sendGCM);
router.post('/apns', APNS.sendAPNS);

router.post('/user/login', Passport.authenticate('bearer', {session: false}), User.login);


router.get('/', Passport.authenticate('bearer', {session: false}), User.welcome);


/** Expose router to other modules **/
module.exports = router;