
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
console.log("OAUTH CALLBACK");
console.log("Session ID:", req.sessionID);
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
    return req.session.save(() => {
      console.log("Session user set:", !!req.session.user);
      console.log("Set-Cookie header:", res.getHeader("set-cookie"));
    res.redirect(`${process.env.FRONTEND_PROD_URL}/${process.env.ADMIN_ROUTE}`);
  });
  
  }
  else {
    res.redirect(process.env.FRONTEND_PROD_URL)
  }
});

authRouter.get('/me', async (req,res) => {
console.log("AUTH ME");
console.log("Session ID:", req.sessionID);
console.log("Session user:", req.session.user);
console.log("Cookies:", req.headers.cookie);
  if (req.session?.user) {
    return res.json({
      authenticated: true,
      user: {
        email: req.session.user.email
      }
    });
  }
  return res.json({ authenticated: false });
});

export default authRouter;



