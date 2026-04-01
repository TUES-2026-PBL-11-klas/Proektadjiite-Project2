import express from 'express';
import authRoutes from './auth.js';
import reportRoutes from './reports.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'UrbanPulse API' });
});

router.use('/auth', authRoutes);
router.use('/reports', reportRoutes);

export default router;
