// modules

import express from 'express';

// helpers
import ResponseObject from '../helpers/ResponseObject';
import ErrorHandler from '../helpers/ErrorHandler';

// general routes
import userRoutes from './users';


const router = express.Router();

/** GET /welcome - Welcome to Yolo API */
router.get('/', (req, res) =>
  res.status(200).json(new ResponseObject(200, 'Welcome to Test Api', []))
);

router.get('/unauthorized', (req, res, next) => {
  const err = { message: 'UNAUTHORIZED', code: 401 };
  return next(new ErrorHandler(err));
});

// mount user routes at /users
router.use('/users', userRoutes);




export default router;
