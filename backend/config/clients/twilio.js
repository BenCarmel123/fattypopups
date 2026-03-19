import dotenvFlow from 'dotenv-flow';
import twilio from 'twilio';
import { logger } from '../../utils/logger.js';

dotenvFlow.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  logger.warn('[TWILIO] WARNING: TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not found in environment variables!');
  logger.warn('[TWILIO] WhatsApp notifications will not be sent.');
} else {
  logger.info('[TWILIO] Twilio client initialized successfully');
}

export const twilioClient = (accountSid && authToken)
  ? twilio(accountSid, authToken)
  : null;
