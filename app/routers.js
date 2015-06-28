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
    Post        = require('./Controller/PostsController'),
    PostResponse = require('./Controller/PostResponsesController'),
    Photo       = require('./Controller/PhotosController'),
    Channel     = require('./Controller/ChannelsController'),
    Message     = require('./Controller/MessagesController'),
    Event     = require('./Controller/EventsController'),
    queryParser = require('./Component/QueryParser'),
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

router.route('/users/:userId/feeds')
  .get(Auth.isAuthenticated, User.getFeeds);

router.route('/users/facebook/:facebookId/feeds')
  .get(Auth.isAuthenticated, User.getFeedsByFbId);

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



/** POST/DIPS ROUTES **/

router.route('/posts')
  .get(Auth.isAuthenticated, Post.getAllPosts)
  .put(Auth.isAuthenticated, Post.updateAllPosts);


router.route('/posts/:id')
  .get(Auth.isAuthenticated, Post.getPost)
//  .put(Auth.isAuthenticated, Post.updatePost)
  .delete(Auth.isAuthenticated, Post.deletePost);

router.route('/users/:userId/posts')
  .post(Auth.isAuthenticated, multipartyMiddleware, Post.postUserPosts)
  .get(Auth.isAuthenticated, Post.getUserPosts)
  .delete(Auth.isAuthenticated, Post.deleteUserPosts); 

router.route('/users/:userId/posts/active')
  .get(Auth.isAuthenticated, Post.getUserActivePost); 

//router.route('/posts/:id/deactivate')
//  .put(Auth.isAuthenticated, Post.expirePost); 

/** Admin routes **/

router.route('/admin/posts')
  .get(Auth.isAuthenticated, Post.getPosts);

/** RESPONSE ROUTES **/


router.route('/responses')
  .delete(Auth.isAuthenticated, PostResponse.deleteAll);

router.route('/users/:userId/responses')
  .get(Auth.isAuthenticated, PostResponse.getMyResponses);

router.route('/users/:userId/responses/read')
  .put(Auth.isAuthenticated, PostResponse.markAllAsRead);

router.route('/users/:userId/messages')
  .get(Auth.isAuthenticated, Channel.getMyMessages);

router.route('/responses/:id')
  .get(Auth.isAuthenticated, PostResponse.responseById)
  .put(Auth.isAuthenticated, PostResponse.updateResponse);

router.route('/posts/:postId/responses')
  .post(Auth.isAuthenticated, PostResponse.addResponse)
  .get(Auth.isAuthenticated, PostResponse.getResponses)
  .delete(Auth.isAuthenticated, PostResponse.deleteResponses);

router.route('/posts/:postId/responses/read')
  .put(Auth.isAuthenticated, PostResponse.markAsRead);

router.route('/posts/:postId/responses/:id')
  .delete(Auth.isAuthenticated, PostResponse.deleteAResponse);


/** PHOTO ROUTES **/

router.route('/users/:userId/photos')
  .post(Auth.isAuthenticated, Photo.postUserProfilePhoto)
  .get(Auth.isAuthenticated, Photo.getUserPhotos)
  .delete(Auth.isAuthenticated, Photo.deleteUserPhotos); 

//do not use it for production now
router.route('/users/:userId/photos/bulk')
  .post(Auth.isAuthenticated, Photo.postUserProfilePhotoBulk);

router.route('/users/:userId/posts/:postId/photos')
  .post(Auth.isAuthenticated, Photo.postUserPostPhoto)
  .get(Auth.isAuthenticated, Photo.getUserPostPhotos);


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


/***** SPECIAL ROUTES **********************/

//notifiers
//router.route('/users/:userId/feeds/:created')
//  .get(Auth.isAuthenticated, Feeds.notify)

router.route('/users/:userId/events') // takes created as query param if needed
  .get(Auth.isAuthenticated, Event.notify);

router.route('/devices/test') // takes created as query param if needed
  .get(Auth.isAuthenticated, Device.testDevice);



/******  ADMIN ROUTES ***********/
// Only for Admin use --- Login
router.route('/admin/login')                  
  .post(Auth.isAuthenticated, User.login);
// Only for Admin use --- Login
router.route('/admin/logout')
  .get(Auth.isAuthenticated, User.logout);






/** Expose router to other modules **/
module.exports = router;
