/**
* Initializing the Router essentials
**/
var express     = require('express'),
    Passport    = require('passport'),
    Auth        = require('./Component/Auth'),  
    GCM         = require('./Component/GCM'),
    APNS        = require('./Component/APN'),
    User        = require('./Controller/UsersController'),
    app         = express();

/** Created an instance of the express Router **/
var router = express.Router(); 

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    res.setHeader('Access-Control-Allow-Headers', 'APIKEY');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

/** Initialize Passport.js **/
app.use(Passport.initialize());



/** ROUTER DECLARATION STARTS HERE **/

router.get('/unauthorized', function(req, res) {
  res.json({ message: "The request is Unauthorized" });
});

router.route('/')
  .get(Auth.isAuthenticated, User.welcome);

/** Create endpoint handlers for /users */
router.route('/users')
  .post(Auth.isAuthenticated, User.postUsers)
  .get(Auth.isAuthenticated, User.getUsers);

router.route('/user/:id')
  .get(Auth.isAuthenticated, User.getUser)
  .put(Auth.isAuthenticated, User.updateUser)
  .delete(Auth.isAuthenticated, User.deleteUser);


/** Expose router to other modules **/
module.exports = router;