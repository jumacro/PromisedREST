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
    Client      = require('./Controller/OauthController'),
    app         = express();

/** Created an instance of the express Router **/
var router = express.Router(); 

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

/** Initialize Passport.js **/
app.use(Passport.initialize());



/** ROUTER DECLARATION STARTS HERE **/
router.get('/', User.welcome);

/** Create endpoint handlers for /users */
router.route('/users')
  .post(User.postUsers)
  .get(User.getUsers);

router.route('/user/:id')
  .get(User.getUser)
  .put(User.updateUser)
  .delete(User.deleteUser);


/**
* Part to authenticate app via a three-legged authentication with Oauth2.0
*/
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