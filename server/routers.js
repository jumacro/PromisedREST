/**
* Initializing the Router essentials
**/
var express                   = require('express'),
    Passport                  = require('passport'),
    Auth                      = require('./Components/Auth'),
    User                      = require('./Controllers/UsersController'),
    Device                    = require('./Controllers/DevicesController'),
    Team                      = require('./Controllers/TeamsController'),
    Player                    = require('./Controllers/PlayersController'),
    Match                     = require('./Controllers/MatchesController'),
    Result                    = require('./Controllers/ResultsController'),
    Raid                      = require('./Controllers/RaidsController'),
    queryParser               = require('./Components/QueryParser'),
    multiparty                = require('connect-multiparty'),
    multipartyMiddleware      = multiparty(),
    server                    = express();

/** Created an instance of the express Router **/
var router = express.Router();

/** Initialize Passport.js **/
server.use(Passport.initialize());

/** ROUTER DECLARATION STARTS HERE **/

router.get('/unauthorized', function(req, res) {
  res.json({ message: "The request is Unauthorized" });
});

router.get('/', function (req, res) {
    res.json({message: 'API v. 1.0'});
});

/** USER ROUTES **/

router.route('/users')
  .post(Auth.isAuthenticated, User.postUsers)
  .get(Auth.isAuthenticated, User.getUsers);

//router.route('/users/nophotos/find')
//  .get(Auth.isAuthenticated, User.getUserWithoutPhoto);

router.route('/users/:id')
  .get(Auth.isAuthenticated, User.getUser)
  .put(Auth.isAuthenticated, User.updateUser)  // shall be used for all user edit operations, like change password, profile edit etc..
  .delete(Auth.isAuthenticated, User.deleteUser);

router.route('/users/facebook/:facebookId')
  .get(Auth.isAuthenticated, User.getUserByFbId);

router.route('/users/:userId/devices')
  .post(Auth.isAuthenticated, Device.registerDevice);

router.route('/devices')
  .get(Auth.isAuthenticated, Device.getAllDevices);

/** Expose router to other modules **/
module.exports = router;
