import jwt from 'jsonwebtoken';
import { logger } from '../../utils/logger.js';

export const isAuthorized = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        logger.warn('[AUTH] Invalid token:', err.message);
        return res.status(401).json({ error: 'Invalid token' });
  }
};
