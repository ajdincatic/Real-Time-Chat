import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// middleware function to check if user is logged in
function requireAuth(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader
    ? authorizationHeader.replace('Bearer ', '')
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.username = decoded.username;
    next();
  });
}

function getUserDataFromToken(req) {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader
      ? authorizationHeader.replace('Bearer ', '')
      : null;

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
}

export { requireAuth, getUserDataFromToken };
