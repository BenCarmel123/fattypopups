
import { google } from 'googleapis';
import express from 'express';

const redirectUri = process.env.GOOGLE_REDIRECT_PROD_URI;

// Initialize Google Auth
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectUri
);

const authRouter = express.Router();

authRouter.get('/google', (req, res) => {
  console.log("REDIRECT URI:", redirectUri);
  const url = oauth2Client.generateAuthUrl({
    scope: ['openid', 'email', 'profile'],
    redirect_uri: redirectUri,
  });

  res.redirect(url);
});

authRouter.get('/google/callback', async (req, res) => {
  const validateEmail = (email) => {
  const adminEmails = [
    process.env.BEN_EMAIL.toLowerCase(),
    process.env.HALLIE_EMAIL.toLowerCase()
  ].filter(Boolean);

  return adminEmails.includes(email);
}
  const code = req.query.code;

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const ticket = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const email = payload.email;

  console.log('[DEBUG] Logged in as:', email);

  const isAdmin = validateEmail(email)
  console.log('[DEBUG] isAdmin:', isAdmin);
  if (isAdmin) {
    req.session.user = 
    {
      email,
      provider: 'google'
    };
    res.redirect(`${process.env.FRONTEND_PROD_URL}/${process.env.ADMIN_ROUTE}`);
  }
  else {
    res.redirect(process.env.FRONTEND_PROD_URL)
  }
});

authRouter.get('/me', async (req,res) => {
  console.log('[DEBUG me] sessionID:', req.sessionID);
  if (req.session?.user) {
    return res.json({
      authenticated: true,
      user: {
        email: req.session.user.email
      }
    });
  }
  res.json({ authenticated: false });
  console.log('[DEBUG me] sessionID:', req.sessionID);
});

export default authRouter;



