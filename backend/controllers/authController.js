import jwt from 'jsonwebtoken';
import { oauth2Client } from '../config/index.js';
import { logger } from '../utils/logger.js';

const isAdminEmail = (email) => {
  const adminEmails = [process.env.BEN_EMAIL, process.env.HALLIE_EMAIL]
    .filter(Boolean)
    .map(e => e.toLowerCase());
  return adminEmails.includes(email);
};

export const redirectToGoogle = (_req, res) => {
  const url = oauth2Client.generateAuthUrl({
    scope: ['openid', 'email', 'profile'],
  });
  res.redirect(url);
};

export const handleGoogleCallback = async (req, res, next) => {
  try {
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const email = ticket.getPayload().email.toLowerCase();
    logger.info(`[AUTH] Logged in as: ${email} | isAdmin: ${isAdminEmail(email)}`);

    if (isAdminEmail(email)) {
      const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
      logger.info('[AUTH] GOOGLE CALLBACK');
      logger.info('[AUTH] JWT created:', !!token);
      return res.redirect(`${process.env.FRONTEND_URL}/${process.env.ADMIN_ROUTE}?token=${token}`);
    }

    return res.redirect(process.env.FRONTEND_URL);
  } catch (err) {
    next(err);
  }
};

export const checkAuth = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ authenticated: false });
  }

  const token = authHeader.split(' ')[1];
  logger.info('[AUTH] AUTH CHECK');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const emailToName = {
      [process.env.BEN_EMAIL?.toLowerCase()]: 'Ben',
      [process.env.HALLIE_EMAIL?.toLowerCase()]: 'Hallie'
    };
    const name = emailToName[decoded.email?.toLowerCase()] ?? decoded.email;
    logger.info('[AUTH] JWT valid for:', name);
    return res.json({ authenticated: true, user: { email: decoded.email } });
  } catch (e) {
    logger.error('JWT invalid:', e.message);
    return res.json({ authenticated: false });
  }
};