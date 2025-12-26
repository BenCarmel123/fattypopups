
import { google } from 'googleapis';
import express from 'express';
import jwt from "jsonwebtoken";

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
    process.env.BEN_EMAIL,
    process.env.HALLIE_EMAIL].filter(Boolean)
  .map(e => e.toLowerCase());

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
  const email = payload.email.toLowerCase();

  console.log('[DEBUG] Logged in as:', email);

  const isAdmin = validateEmail(email)

  console.log("[DEBUG] isAdmin:", isAdmin);

  if (isAdmin) {
    const token = jwt.sign(
      { email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" });
      console.log("[DEBUG] GOOGLE CALLBACK");
    console.log("[DEBUG] JWT created:", !!token);
    return res.redirect(`${process.env.FRONTEND_PROD_URL}/${process.env.ADMIN_ROUTE}?token=${token}`);
    } 
  else return res.redirect(process.env.FRONTEND_PROD_URL);
})

authRouter.get("/check", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({ authenticated: false });
  }

  const token = authHeader.split(" ")[1];
  console.log("[DEBUG] AUTH CHECK");
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[DEBUG] JWT valid for:", decoded.email)
    return res.json({
      authenticated: true,
      user: {
        email: decoded.email,
      },
    });
  } catch {
    console.log("[ERROR] JWT invalid:", e.message);
    return res.json({ authenticated: false });
  }
});

export default authRouter;



