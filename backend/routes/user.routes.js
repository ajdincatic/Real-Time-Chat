import dotenv from 'dotenv';
dotenv.config();

import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  getUserDataFromToken,
  requireAuth,
} from '../middleware/auth.middleware';
import {
  createUser,
  getFirstUserByField,
  getAllUsers,
} from '../schema/user.schema';

const router = Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, username, password } = req.body;

  const user = await getFirstUserByField('username', username).catch(() => {
    return res.status(500).json({ error: 'Internal server error' });
  });

  if (user) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  const hash = await bcrypt.hash(password, 10).catch(() => {
    return res.status(500).json({ error: 'Internal server error' });
  });

  const id = await createUser({
    firstName,
    lastName,
    username,
    password: hash,
  });

  res.status(201).json({ id });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await getFirstUserByField('username', username).catch(() => {
    return res.status(500).json({ error: 'Internal server error' });
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

  const token = jwt.sign({ id: user.entityId, username }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res
    .status(200)
    .json({ id: user.entityId, username, token, expiresIn: JWT_EXPIRES_IN });
});

router.get('/', requireAuth, async (req, res) => {
  const loggedUserId = getUserDataFromToken(req).id;

  const users = await getAllUsers(loggedUserId).catch(() => {
    return res.status(500).json({ error: 'Internal server error' });
  });

  res.status(201).json(users);
});

router.get('/me', requireAuth, async (req, res) => {
  const userData = getUserDataFromToken(req);

  if (!userData) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.status(200).send(userData);
});

export default router;
