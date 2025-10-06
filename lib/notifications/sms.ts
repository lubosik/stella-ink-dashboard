/**
 * SMS notification system using Twilio
 * Sends booking reminders to prospects
 */

import twilio from 'twilio';

interface SMSParams {
  to: string;
  name: string;
  estimateRange: string;
  bookingUrl: string;
}

/**
 * Send SMS to prospect with estimate and booking link
 */
export async function sendSMS({ to, name, estimateRange, bookingUrl }: SMSParams) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.warn('Twilio credentials not configured. Skipping SMS.');
    return;
  }

  const client = twilio(accountSid, authToken);

  const message = `Hi ${name}! Your SMP estimate from Stella's Ink Chamber: ${estimateRange}. Book your free consultation: ${bookingUrl}`;

  try {
    await client.messages.create({
      body: message,
      from: fromNumber,
      to: to
    });
  } catch (error) {
    console.error('Twilio SMS error:', error);
    throw error;
  }
}
