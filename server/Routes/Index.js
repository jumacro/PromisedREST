import express from 'express';
import userRoutes from './User';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/api-health-check', (req, res) =>
  res.send('OK')
);


// mount user routes at /users
router.use('/users', userRoutes);



export default router;
