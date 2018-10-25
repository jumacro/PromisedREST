// modules

import express from 'express';

// helpers
import ResponseObject from '../../helpers/ResponseObject';
import ErrorHandler from '../../helpers/ErrorHandler';

// general routes
import userRoutes from './User';
import merchantRoutes from './Merchant';
import customerRoutes from './Customer';
import categoryRoutes from './Category';





const router = express.Router();

/** GET /welcome - Welcome to Yolo API */
router.get('/', (req, res) =>
  res.status(200).json(new ResponseObject(200, 'Welcome to IP Admin RestAPI', []))
);
router.get('/welcome', (req, res) =>
  res.status(200).json(new ResponseObject(200, 'Welcome to IP RestAPI', []))
);
router.get('/Unauthorized', (req, res, next) => {
  const err = { code: 401 };
  return next(new ErrorHandler(err));
});

// mount user routes at /users
router.use('/users', userRoutes);

// mount user routes at /merchents
router.use('/merchants', merchantRoutes);

// mount user routes at /customer
router.use('/customers', customerRoutes);

// mount category routes at /categories
router.use('/categories', categoryRoutes);


export default router;
