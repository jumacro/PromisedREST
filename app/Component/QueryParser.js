
var queryParser = require('../Plugin/QueryParser');

module.exports = function (req, res, next) {
    if (req.query._q) {
        // map available aliases to fieldnames
        var fieldNames = queryParser.map(req.query._q, req.query._a);

        // parse the query string
        var qParameters = queryParser.parse(req.query, fieldNames);

        // build the query
        req.mongo_query = queryParser.build(qParameters);
    }

    req.mongo_query = req.mongo_query || {};
    next();
};