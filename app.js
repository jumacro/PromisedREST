import mongoose from 'mongoose';
import util from 'util';
import envConfig from './env';
import app from './config/express';

const debug = require('debug')('promised-rest:App');

const port = process.env.PORT || envConfig.port;
const env = process.env || envConfig.env;

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

Promise.config({
    // Enable cancellation
  cancellation: true,
});

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;
// connect to mongo db
mongoose.connect(envConfig.db, { server:  { poolSize: 10, socketOptions: { keepAlive: 2000, connectTimeoutMS: 30000 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${envConfig.db}`);
});

// print mongoose logs in dev env
// print mongoose logs in dev env
if (envConfig.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

app.disable('etag');
// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port port
  app.listen(port, () => {
    debug(`promised-rest server started on port ${port} (${env})`);
  });
}

/*
process.on('SIGINT', function(){
    mongoose.connection.close(function(){
      console.log("Mongoose default connection is disconnected due to application termination");
       process.exit(0);
      });
});

*/

export default app;
