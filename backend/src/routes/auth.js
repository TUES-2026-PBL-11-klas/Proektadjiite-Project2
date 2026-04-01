import express from 'express';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import prisma from '../db.js';
import asyncHandler from '../utils/asyncHandler.js';
import { signToken, toAuthUser } from '../utils/auth.js';

const router = express.Router();
const SALT_ROUNDS = 10;

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    const displayName = req.body.display_name?.trim();

    if (!email || !password || !displayName) {
      return res
        .status(400)
        .json({ error: 'email, password, and display_name are required' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: 'password must be at least 8 characters long' });
    }

    try {
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await prisma.user.create({
        data: {
          email,
          password_hash: passwordHash,
          display_name: displayName,
        },
      });

      const authUser = toAuthUser(user);

      return res.status(201).json({
        token: signToken(authUser),
        user: authUser,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return res.status(409).json({ error: 'email already registered' });
      }

      throw error;
    }
  }),
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    const authUser = toAuthUser(user);

    return res.json({
      token: signToken(authUser),
      user: authUser,
    });
  }),
);

export default router;
