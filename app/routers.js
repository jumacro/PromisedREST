/**
* Initializing the Router essentials
**/
var express     = require('express'),
    Passport    = require('passport'),
    Oauth2      = require('./Component/Oauth2'),  
    Auth        = require('./Component/Auth'),  
    GCM         = require('./Component/GCM'),
    APNS        = require('./Component/APN'),
    User        = require('./Controller/UsersController'),
    Client      = require('./Component/OauthClient'),
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

/** Create endpoint handlers for /users */
router.route('/users')
  .post(User.postUsers)
  .get(Auth.isAuthenticated, User.getUsers);

/** Create endpoint handlers for /clients */
router.route('/clients')
  .post(Auth.isAuthenticated, Client.postClients)
  .get(Auth.isAuthenticated, Client.getClients);

/** Create endpoint handlers for oauth2 authorize */
router.route('/oauth2/authorize')
  .get(Auth.isAuthenticated, Oauth2.authorization)
  .post(Auth.isAuthenticated, Oauth2.decision);

/** Create endpoint handlers for oauth2 token */
router.route('/oauth2/token')
  .post(Auth.isClientAuthenticated, Oauth2.token);


/** Expose router to other modules **/
module.exports = router;