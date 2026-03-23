// Legacy: WhatsApp notifications are currently disabled but kept for future reactivation
import { twilioClient } from '../../config/clients/twilio.js';

export const notifyUsers = async (title) => {
  await twilioClient.messages.create({
    from: process.env.TWILIO_SANDBOX_NUMBER,
    to: process.env.BEN_WHATSAPP_NUMBER,
    body: `check out ${title} online`,
  });
};
