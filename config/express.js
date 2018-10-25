import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import passport from 'passport';
import helmet from 'helmet';
import winstonInstance from './winston';
import routes from '../api/routes/Index';
import adminRoutes from '../api/routes/Admins/Index';
import merchantRoutes from '../api/routes/Merchants/Index';
import config from '../env';
import settings from '../constants/settings';
import APIError from '../api/helpers/APIError';
import ResponseObject from '../api/helpers/ResponseObject';


const app = express();

const debug = require('debug')('ip-api:Settings/Express');

if (config.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

/** version 2 block */
// initializing passport
// const authorize = new Auth();
app.use(passport.initialize());

// enable CORS - Cross Origin Resource Sharing
// app.use(cors());

app.use(cors({
  origin: true,
  methods: 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
  allowedHeaders: 'Origin, Content-Type, Accept, Authorization, X-Request-With, Content-Range, Content-Disposition, Content-Description',
  credentials: true
}));

// enable detailed API logging in dev env
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}

app.use(express.static('public'));


// mount all routes on / path
// debug(settings.apiVersion);
app.use(`/api/${settings.apiVersion}`, routes);

app.use(`/admin-api/${settings.apiVersion}/`, adminRoutes);

app.use(`/merchant-api/${settings.apiVersion}/`, merchantRoutes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  let errStack = [];
  if (config.env === 'development') {
    debug(err.stack);
    errStack = err.stack;
  }
  res.status(err.status).json(new ResponseObject(err.status, err.message, errStack));
});

export default app;
