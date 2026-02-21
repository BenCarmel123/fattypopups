import dotenvFlow from 'dotenv-flow';
import { google } from 'googleapis';
import { logger } from "../../utils/logger.js";

// Load environment variables
dotenvFlow.config();

const redirectUri = process.env.GOOGLE_REDIRECT_URI;

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !redirectUri) {
  throw new Error(`Missing Google OAuth credentials in environment: ${process.env.NODE_ENV || 'development'}`);
}

// Initialize Google Auth
export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectUri
);

logger.info(`[AUTH] Google OAuth configured (${process.env.NODE_ENV || 'development'} environment) | Redirect URI: ${redirectUri}`);
