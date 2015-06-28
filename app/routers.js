/**
* Initializing the Router essentials
**/
var express     = require('express'),
    Passport    = require('passport'),
    Auth        = require('./Component/Auth'),
    //GCM         = require('./Component/GCM'),
    //APNS        = require('./Component/APN'),
    User        = require('./Controller/UsersController'),
    Device      = require('./Controller/DevicesController'),
    Block       = require('./Controller/UserBlocksController'),
    Report       = require('./Controller/ReportsController'),
    Channel     = require('./Controller/ChannelsController'),
    Message     = require('./Controller/MessagesController'),
    QueryParser = require('./Component/QueryParser'),
    multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty(),
    app         = express();

/** Created an instance of the express Router **/
var router = express.Router();

/** Initialize Passport.js **/
app.use(Passport.initialize());

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



/********** BLOCK ROUTES ***********/

router.route('/users/:userId/blocks')
  .get(Auth.isAuthenticated, Block.getMyBlocklist)
  .post(Auth.isAuthenticated, Block.blockUser);

router.route('/users/:userId/blocks/:blockedUserId')
  .delete(Auth.isAuthenticated, Block.removeUserBlock);

router.route('/blocks')
  .get(Auth.isAuthenticated, Block.allBlocks)
  .delete(Auth.isAuthenticated, Block.removeAllBlocks);

/********** REPORT ROUTES ***********/

router.route('/users/:userId/reports')
  .get(Auth.isAuthenticated, Report.getMyReportlist)
  .post(Auth.isAuthenticated, Report.reportUser)
  .delete(Auth.isAuthenticated, Report.removeUserReport);

router.route('/users/:userId/post/:postId/blocks/reports')
  .post(Auth.isAuthenticated, Report.reportPost)
  .delete(Auth.isAuthenticated, Report.removePostReport);


router.route('/users/:userId/messages')
  .get(Auth.isAuthenticated, Channel.getMyMessages);


/****** CHANNELS AND MESSAGES ********************/

router.route('/channels')
  .post(Auth.isAuthenticated, Channel.addChannel)
  .get(Auth.isAuthenticated, Channel.getAll)
  .delete(Auth.isAuthenticated, Channel.deleteAll);

router.route('/messages')
  .get(Auth.isAuthenticated, Message.getAll);

router.route('/users/:userId/channels')
  .get(Auth.isAuthenticated, Channel.getMyChannels)
  .delete(Auth.isAuthenticated, Channel.deleteMyChannels);

router.route('/channels/:channelId/history')
  .get(Auth.isAuthenticated, Channel.getChannelMessages)
  .delete(Auth.isAuthenticated, Message.clearHistory);


router.route('/channels/:channelId/:userId/messages')
  .put(Auth.isAuthenticated, Channel.readChannelMessages);

/*****************************************************/

router.route('/devices/test') // takes created as query param if needed
  .get(Auth.isAuthenticated, Device.testDevice);


/** Expose router to other modules **/
module.exports = router;
