var schema = require('../../schema');
var Feed = schema.Feed;
var User = schema.User;
var db = schema.sequelize;
var table = 'zid_feeds';

exports.getAllFeeds = function(callback){
    db.query('select feed.*, zid_users.*  from zid_feeds as feed join zid_users on zid_users.id = feed.id order by feed.feed_id ASC limit 0, 10')
    .error(function(err){
       console.log(err); 
    })
    .success(function(data) {
      callback(data);
    })
} 