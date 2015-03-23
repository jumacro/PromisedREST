
var Sequelize = require('sequelize');
var config = require('../config/config');
var sequelize = new Sequelize(config.database, config.username, config.password, {   

    // custom host; default: localhost
    host: config.host,

    // custom port; default: 3306
    port: 3306,
    // disable logging; default: console.log
    logging: false,
    // max concurrent database requests; default: 50
    maxConcurrentQueries: 100,

    // the sql dialect of the database
    // - default is 'mysql'
    // - currently supported: 'mysql', 'sqlite', 'postgres'
    dialect: config.dialect,

    rand: function() {
        return parseInt(Math.random() * 999)
    },
    // use pooling in order to reduce db connection overload and to increase speed
    // currently only for mysql and postgresql (since v1.5.0)
    pool: { 
        maxConnections: 5, maxIdleTime: 30
    }
});

//load models
var models = [
    'User',
    'UserRole',
    'Message',
    'Device',
    'UserToken',
    'oauthClient',
    'oauthToken',
    'oauthRefreshToken'
]
//to do gives error here
models.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});

// describe relationships
(function(m) {

//    m.UserRole.hasMany(m.User);
//    m.User.belongsTo(m.UserRole);  

    //relation between User and Device
    m.User.hasMany(m.Device);
    m.Device.belongsTo(m.User);

    //user token relation with user
    m.User.hasMany(m.UserToken);
    m.UserToken.belongsTo(m.User);

    //feed relation with user
    //m.User.hasMany(m.Feed, { foreignKey: 'id'} ); 
    //m.Feed.belongsTo(m.User, { foreignKey: 'id'} );
      
    
})(module.exports);

// export connection
module.exports.sequelize = sequelize;