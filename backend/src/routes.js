import express from 'express';
import prisma from './db.js';

const router = express.Router();

// Test route to verify DB works
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Database fetch failed', details: error.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { email, name } = req.body;
    const newUser = await prisma.user.create({
      data: { email, name },
    });
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'User creation failed', details: error.message });
  }
});

export default router;
