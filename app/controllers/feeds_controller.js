
/*
 * Requires the feed model.
 */
var feed = require('../models/feed');

/**
    Get all feeds with pagination.
    Passes the calculated offset, and limit to model
    The returning data is 
        data.counts :- The total number of rows present in the main query
        data.rows :- The rows as the resultant of the offset and limit
**/
exports.getAllFeeds = function(req, res)
{
    feed.getAllFeeds(function(data){
        res.json(data);
    });
}